const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    createProxyMiddleware('/chat', {
      target: 'ws://localhost:8080',
      changeOrigin: true,
      ws: true,
      logLevel: 'debug',
    }),
  );
};
