import AuthRoutes from './auth';
import { Application } from 'express';
import UserRoutes from './users';

export default (app: Application) => {
  AuthRoutes(app);
  UserRoutes(app);
};
