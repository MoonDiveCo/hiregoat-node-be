import user from './api/v1/controllers/user/routes';
import employee from './api/v1/controllers/employer/routes';
import organization from './api/v1/controllers/organization/routes';

export default function routes(app) {
  app.use('/api/v1/user', user);
  app.use('/api/v1/employee', employee);
  app.use('/api/v1/organization', organization);
  app.use('/api/v1/leave', leave);

  return app;
}
