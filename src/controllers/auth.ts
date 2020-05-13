import * as AuthServices from "../services/auth";

export const anonymous = async (req: any, res: any, next: any) => {
  try {
    const token = await AuthServices.anonymous(req.ctx);
    res.json({ token });
  } catch (e) {
    next(e);
  }
};

export const fetch = async (req: any, res: any, next: any) => {
  try {
    res.json(req.ctx);
  } catch (e) {
    next(e);
  }
};

export const login = async (req: any, res: any, next: any) => {
  try {
    const payload = await AuthServices.login(req.body, req.ctx);
    res.json(payload)
  } catch (e) {
    next(e)
  }
}
