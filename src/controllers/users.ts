import { UserServices } from '../services/user';

export class UserController {
  static adminCreate = async (req: any, res: any, next: any) => {
    try {
      await UserServices.createAdmin();
      res.json({ success: true, username: 'root' });
    } catch (error) {
      next(error);
    }
  };

  static create = async (req: any, res: any, next: any) => {
    try {
      const payload = await UserServices.create(req.body, req.ctx);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  };

  static remove = async (req: any, res: any, next: any) => {
    try {
      await UserServices.remove(req.params.id, req.ctx);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };

  static update = async (req: any, res: any, next: any) => {
    try {
      const user = await UserServices.update(req.body, req.ctx);
      res.json(user);
    } catch (e) {
      next(e);
    }
  };

  static adminUpdate = async (req: any, res: any, next: any) => {
    try {
      const user = await UserServices.adminUpdate(req.body, req.ctx);
      res.json(user);
    } catch (e) {
      next(e);
    }
  };

  static list = async (req: any, res: any, next: any) => {
    try {
      const users = await UserServices.list(req.query, req.ctx);
      res.json(users);
    } catch (e) {
      next(e);
    }
  };
}
