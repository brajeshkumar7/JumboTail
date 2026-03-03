import config from '../config/index.js';

export function notFound(req, res) {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
}

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';
  if (config.app.env !== 'production') {
    console.error(err);
  }
  res.status(status).json({
    error: message,
    ...(config.app.env !== 'production' && { stack: err.stack }),
  });
}
