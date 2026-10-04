local uid = ARGV[0]

local totalSession = redis.call('ZCARD', 'user:'..uid..':session')

return totalSession