import { ProductsServices } from '../services/product'

export class ProductController {
  static create = async (req: any, res: any, next: any) => {
    try {
      const result = await ProductsServices.create(req.body, req.ctx);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  static list = async (req: any, res: any, next: any) => {
    try {
      const result = await ProductsServices.list(req.query, req.ctx);
      res.json(result);
    } catch (e) {
      next(e);
    }
  };

  static fetch = async (req: any, res: any, next: any) => {
    try {
      const result = await ProductsServices.fetch(req.params.id, req.ctx)
      res.json(result)
    } catch (e) {
      next(e)
    }
  }

  static delete = async (req: any, res: any, next: any) => {
    try {
      await ProductsServices.delete(req.params.id, req.ctx)
      res.status(204).send();
    } catch (e) {
      next(e)
    }
  }

  static edit = async (req: any, res: any, next: any) => {
    try {
      const result = await ProductsServices.edit(req.params.id, req.body, req.ctx)
      res.json(result)
    } catch (e) {
      next(e)
    }
  }

  static viewAd = async (req: any, res: any, next: any) => {
    try {
      const result = await ProductsServices.viewAd(req.params.id, req.ctx)
      res.json(result)
    } catch (e) {
      next(e)
    }
  }
}
