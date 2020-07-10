import { CategoriesServices } from '../services/categories';

export class CategoriesController {
  static create = async (req: any, res: any, next: any) => {
    try {
      const result = await CategoriesServices.create(req.body, req.ctx);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  static list = async (req: any, res: any, next: any) => {
    try {
      const result = await CategoriesServices.list(req.query, req.ctx);
      res.json(result);
    } catch (e) {
      next(e);
    }
  };

  static update = async (req: any, res: any, next: any) => {
    try {
      const result = await CategoriesServices.update(req.params.id, req.body, req.ctx);
      res.json(result);
    } catch (error) {
      next(error)
    }
  }

  static delete = async (req: any, res: any, next: any) => {
    try {
      const result = await CategoriesServices.delete(req.params.id, req.ctx)
      res.json(result)
    } catch (error) {
      next(error)
    }
  };
}
