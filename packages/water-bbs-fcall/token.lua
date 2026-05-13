#!lua name=token_mgr

local function resolvedTTL(ttl, fallback)
  if ttl == -2 then return fallback end
  if ttl == -1 then return 0 end
  return ttl
end


local function tokenAlive(keys, args)
  if #args < 2 then
    return redis.error_reply('ERR missing arguments: accountID, tokenID')
  end
  local accountID = args[1]
  local tokenID   = args[2]

  return 1 - redis.call('exists', 'bl:{' .. accountID .. '}:' .. tokenID)
end

redis.register_function("tokenAlive", tokenAlive)


local function blacklist(accountID, tokenID, ttl)
  local black_key = 'bl:{' .. accountID .. '}:' .. tokenID
  redis.call('set', black_key, tokenID)
  if ttl > 0 then
    redis.call('expire', black_key, ttl)
  end
end

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

  local linked_map_key = 'token:map:{' .. accountID .. '}:' .. linkedTokenID
  local linkedTTL = resolvedTTL(redis.call('ttl', linked_map_key), 86400)
  redis.call('zrem', tokens_key, linkedTokenID)
  blacklist(accountID, linkedTokenID, linkedTTL)
  redis.call('del', linked_map_key)

  local currentTTL = resolvedTTL(redis.call('ttl', map_key), 86400)
  redis.call('zrem', tokens_key, tokenID)
  blacklist(accountID, tokenID, currentTTL)
  redis.call('del', map_key)

  return 1
end

redis.register_function("removeToken", removeToken)


local function getTokenTotal(accountID)
  local tokens = 'tokens:{' .. accountID .. '}'
  local total = redis.call('zcard', tokens)
  return total
end
redis.register_function("getTokenTotal", removeToken)


-- 如果当前活跃的rt超出了limit的限制，按照绝对过期时间升序，删除最早的那部分直到 zset 的长度满足 length <= limit
local function gc(accountID, limit)
  local total = getTokenTotal(accountID);
  if total <= limit then return end

  local toRemove    = total - limit
  local shouldRemove = redis.call('zrange', tokens, 0, toRemove - 1)

  for _, tokenID in ipairs(shouldRemove) do
    local map_key = 'token:map:{' .. accountID .. '}:' .. tokenID
    local ttl     = resolvedTTL(redis.call('ttl', map_key), 86400)
    blacklist(accountID, tokenID, ttl)

    local linkedID = redis.call('get', map_key)
    if linkedID then
      local linked_map_key = 'token:map:{' .. accountID .. '}:' .. linkedID
      local linkedTTL = resolvedTTL(redis.call('ttl', linked_map_key), 86400)
      blacklist(accountID, linkedID, linkedTTL)
      redis.call('del', linked_map_key)
      redis.call('zrem', tokens, linkedID)
    end

    redis.call('del', map_key)
    redis.call('zrem', tokens, tokenID)
  end
end

-- 只存rt
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

  -- 留一个位置出来
  gc(accountID, limit - 1)

  redis.call('set', at_map_key, rtID)
  redis.call('expire', at_map_key, atTTL)

  redis.call('set', rt_map_key, atID)
  redis.call('expire', rt_map_key, rtTTL)

  redis.call('zadd', tokens_key, now + rtTTL, rtID)
  return 1;
end

redis.register_function("putTokenPair", putTokenPair)
