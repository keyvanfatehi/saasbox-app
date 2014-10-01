module.exports = {
  test: 'pk_test_7wYQao2Gn0HikrmIQdBEf8yS',
  production: 'pk_live_6zJC07kl7p3Nt6inA1QPsWSq'
}[process.env.NODE_ENV === 'production' ? 'production' : 'test']
