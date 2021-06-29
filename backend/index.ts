import './src/env';
import app from './src/server';

if (process.env.NODE_ENV === 'production') {
  app.listen(process.env.PORT);
}

export const createViteNodeApp = app;
