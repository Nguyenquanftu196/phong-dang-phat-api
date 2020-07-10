import AuthRoutes from './auth';
import { Application } from 'express';
import UserRoutes from './users';
import CategoriesRoutes from './categories'
import ProductRoutes from './product'
import FileRoutes from './file'

export default (app: Application) => {
  AuthRoutes(app);
  UserRoutes(app);
  CategoriesRoutes(app);
  ProductRoutes(app);
  FileRoutes(app);
};
