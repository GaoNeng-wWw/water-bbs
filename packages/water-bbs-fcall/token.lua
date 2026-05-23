#!lua name=token_mgr

-- 将 redis.call('ttl', key) 的返回值转换为实际可用的秒数
-- -2: key 不存在，使用 fallback（通常是业务默认过期时长）
-- -1: key 存在但永不过期，返回 0（blacklist 中 ttl=0 表示永不过期）
--  n: 正常剩余秒数，直接返回
local function resolvedTTL(ttl, fallback)
  if ttl == -2 then return fallback end
  if ttl == -1 then return 0 end
  return ttl
end


-- 将指定 token 加入黑名单，ttl=0 表示永不过期
local function blacklist(accountID, tokenID, ttl)
  local black_key = 'bl:{' .. accountID .. '}:' .. tokenID
  redis.call('set', black_key, tokenID)
  if ttl > 0 then
    redis.call('expire', black_key, ttl)
  end
end


-- 查询某个 token 是否仍然有效（未被拉黑）
-- 返回 1 = 有效，0 = 已失效（在黑名单中）
local function tokenAlive(keys, args)
  if #args < 2 then
    return redis.error_reply('ERR missing arguments: accountID, tokenID')
  end
  local accountID = args[1]
  local tokenID   = args[2]

  return 1 - redis.call('exists', 'bl:{' .. accountID .. '}:' .. tokenID)
end

redis.register_function("tokenAlive", tokenAlive)


-- 获取某账号当前活跃的 RT 数量（即 session 数量）
local function getTokenTotal(accountID)
  local tokens_key = 'tokens:{' .. accountID .. '}'
  return redis.call('zcard', tokens_key)
end

-- 注意：getTokenTotal 是内部辅助函数，不对外暴露为 Redis function
-- 如有需要可取消下面注释：
-- redis.register_function("getTokenTotal", getTokenTotal)


-- 按绝对过期时间升序，删除最旧的 session，直到 zset 长度 <= limit
-- limit=0 时删除全部 session（用于登出所有设备）
local function gc(accountID, limit)
  local tokens_key = 'tokens:{' .. accountID .. '}'
  local total = getTokenTotal(accountID)
  if total <= limit then return end

  local toRemove    = total - limit
  local shouldRemove = redis.call('zrange', tokens_key, 0, toRemove - 1)

  for _, tokenID in ipairs(shouldRemove) do
    local map_key = 'token:map:{' .. accountID .. '}:' .. tokenID
    local ttl     = resolvedTTL(redis.call('ttl', map_key), 86400)
    blacklist(accountID, tokenID, ttl)

    -- RT 的 map_key 存的是关联的 AT ID，一并拉黑
    local linkedID = redis.call('get', map_key)
    if linkedID then
      local linked_map_key = 'token:map:{' .. accountID .. '}:' .. linkedID
      local linkedTTL = resolvedTTL(redis.call('ttl', linked_map_key), 86400)
      blacklist(accountID, linkedID, linkedTTL)
      redis.call('del', linked_map_key)
      redis.call('zrem', tokens_key, linkedID)
    end

    redis.call('del', map_key)
    redis.call('zrem', tokens_key, tokenID)
  end
end


-- 存储一对 AT+RT，同时维护双向映射和 session zset
-- zset 中只存 RT（代表一个 session），score 为绝对过期时间戳
-- 超出 limit 时按最旧 session 优先淘汰
local function putTokenPair(keys, args)
  if #args < 6 then
    return redis.error_reply(
      'ERR missing arguments: accountID, atID, rtID, atTTL, rtTTL, limit'
    )
  end

  local accountID = args[1]
  local atID      = args[2]
  local rtID      = args[3]
  local atTTL     = tonumber(args[4])
  local rtTTL     = tonumber(args[5])
  local limit     = tonumber(args[6])

  if not (atTTL and rtTTL and limit and atTTL > 0 and rtTTL > 0 and limit > 0) then
    return redis.error_reply('ERR TTL and limit must be positive numbers')
  end

  if atID == rtID then
    return redis.error_reply('ERR atID and rtID must be different')
  end

  local now        = tonumber(redis.call('time')[1])
  local tokens_key = 'tokens:{' .. accountID .. '}'

  local at_map_key = 'token:map:{' .. accountID .. '}:' .. atID
  local rt_map_key = 'token:map:{' .. accountID .. '}:' .. rtID

  -- 先腾出一个位置，再写入新 token pair
  gc(accountID, limit - 1)

  -- AT -> RT 的映射
  redis.call('set', at_map_key, rtID)
  redis.call('expire', at_map_key, atTTL)

  -- RT -> AT 的映射
  redis.call('set', rt_map_key, atID)
  redis.call('expire', rt_map_key, rtTTL)

  -- RT 进 zset，score = 绝对过期时间戳（用于 gc 排序）
  redis.call('zadd', tokens_key, now + rtTTL, rtID)

  return 1
end

redis.register_function("putTokenPair", putTokenPair)


-- 撤销单个 token（AT 或 RT 均可传入）
-- 会同时拉黑该 token 及其关联的另一半，并从 zset 中移除
-- 返回 1 = 成功撤销，0 = token 不存在（可能已过期或已撤销）
local function removeToken(keys, args)
  if #args < 2 then
    return redis.error_reply('ERR missing arguments: accountID, tokenID')
  end
  local accountID  = args[1]
  local tokenID    = args[2]
  local tokens_key = 'tokens:{' .. accountID .. '}'
  local map_key    = 'token:map:{' .. accountID .. '}:' .. tokenID

  local linkedTokenID = redis.call('get', map_key)
  if not linkedTokenID then
    return 0
  end

  -- 拉黑并清理关联 token
  local linked_map_key = 'token:map:{' .. accountID .. '}:' .. linkedTokenID
  local linkedTTL = resolvedTTL(redis.call('ttl', linked_map_key), 86400)
  redis.call('zrem', tokens_key, linkedTokenID)
  blacklist(accountID, linkedTokenID, linkedTTL)
  redis.call('del', linked_map_key)

  -- 拉黑并清理当前 token
  local currentTTL = resolvedTTL(redis.call('ttl', map_key), 86400)
  redis.call('zrem', tokens_key, tokenID)
  blacklist(accountID, tokenID, currentTTL)
  redis.call('del', map_key)

  return 1
end

redis.register_function("removeToken", removeToken)


-- 撤销某账号的全部 session（登出所有设备）
-- 返回 1 = 执行完成
local function removeAllTokenByAccountId(keys, args)
  if #args < 1 then
    return redis.error_reply('ERR missing arguments: accountID')
  end
  local accountID = args[1]
  gc(accountID, 0)
  return 1
end

redis.register_function("removeAllTokenByAccountId", removeAllTokenByAccountId)