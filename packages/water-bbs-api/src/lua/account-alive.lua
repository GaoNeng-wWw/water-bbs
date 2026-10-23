local uid = ARGV[1]

return redis.call('zcard', 'user:' .. uid .. ':session') ~= 0