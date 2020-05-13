import * as JWTUtils from '../utils/jwt';
import { BadRequestError, ForbiddenError } from '../utils/errors';
import { compare } from '../utils/bcrypt';
import { getModels } from '../models/db.tables';
import { MySQLClient } from '../clients/mysql';

const { Users } = getModels(MySQLClient);

export const anonymous = async (ctx: any) => JWTUtils.sign({ ...ctx });

export const login = async (params: any, ctx: any) => {
  const parentTransaction = ctx.transaction;
  const { username, password } = params;
  let userDB = await Users.findOne({ where: { username }, transaction: parentTransaction });
  if (!userDB) {
    throw new BadRequestError({ field: 'username', message: 'Credentials are invalid' });
  }

  if (userDB.status === 'PAUSE') {
    throw new ForbiddenError({ field: 'username', message: 'Credentials are invalid' });
  }

  const isSamePassword = await compare(password, userDB.password);

  if (!isSamePassword) {
    throw new BadRequestError({ field: 'password', message: 'Credentials are invalid' });
  }

  let user: any = userDB.get({ plain: true });

  const token = await JWTUtils.sign({ ...ctx, user });

  return { token, user };
};


