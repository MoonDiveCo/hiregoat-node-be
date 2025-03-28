import user from './api/v1/controllers/user/routes';
import employer from './api/v1/controllers/employer/routes';
import candidate from './api/v1/controllers/candidate/routes';

export default function routes(app) {
  app.use('/api/v1/user', user);
  app.use('/api/v1/employer', employer);
  app.use('/api/v1/candidate', candidate);
  
  return app;
}
