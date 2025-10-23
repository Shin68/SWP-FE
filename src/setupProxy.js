const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // intercept all requests starting with /api
    createProxyMiddleware({
      target: 'http://localhost:8080', // backend URL
      changeOrigin: true,
      logLevel: 'debug', // optional: logs proxy actions
    })
  );
};
