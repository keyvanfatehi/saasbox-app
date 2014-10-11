module.exports = {
  api: {
    v1: require('./api/v1')
  },
  web: {
    public: require('./web/public'),
    private: require('./web/private')
  }
}
