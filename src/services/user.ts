import { encrypt, compare } from '../utils/bcrypt';
import { MySQLClient } from '../clients/mysql';
import { getModels } from '../models/db.tables';
import uuidv4 from 'uuid/v4';
import { sign } from '../utils/jwt';
import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errors';
import { UserStatus } from '../constants/users';
import { DEFAULT_LIMIT } from '../constants/collections';

const { Users } = getModels(MySQLClient);

export class UserServices {
  static createAdmin = async () => {
    const hash = await encrypt('root');

    const admin = await Users.findOne({ where: { username: 'root' }, raw: true });

    if (admin) {
      return admin;
    }

    return Users.create({
      username: 'root',
      password: hash,
      status: UserStatus.Active,
      isAdmin: true
    });
  };

  static create = async (params: any, ctx: any) => {
    await UserServices.isUserAdmin(ctx);

    const hash = await encrypt(params.password);

    return Users.create({
      username: params.username,
      password: hash,
      email: params.email,
      status: UserStatus.Active,
      teamId: params.teamId,
      isAdmin: Boolean(params.isAdmin),
      contractNumber: params.contractNumber,
      contractExpDate: params.contractExpDate,
    });
  };

  static isUserAdmin = async (ctx: any) => {
    const { user } = ctx;

    if (!user) {
      throw new ForbiddenError({ message: 'User is not admin', field: 'id' });
    }

    const userAdminDB = await Users.findOne({ where: { id: user.id } });

    if (!userAdminDB) {
      throw new ForbiddenError({ message: 'User is not admin', field: 'id' });
    }

    if (!userAdminDB.isAdmin) {
      throw new ForbiddenError({ message: 'User is not admin', field: 'isAdmin' })
    }
  }

  static remove = async (id: any, ctx: any) => {
    await UserServices.isUserAdmin(ctx);

    return MySQLClient.transaction(async (transaction) => {
      const user = await Users.findOne({ where: { id }, transaction });

      if (!user) {
        throw new NotFoundError({ message: 'User not found', field: 'id' });
      }

      return user.destroy({ transaction });
    });
  };

  static update = async (params: any, ctx: any) => {
    const { user } = ctx;

    const userDB = await Users.findOne({ where: { id: user.id } });

    if (!userDB) {
      throw new NotFoundError({ message: 'User not found', field: 'id' });
    }

    if (params.password && params.oldPassword) {
      const isPasswordsSame = await compare(params.oldPassword, user.password);
      if (isPasswordsSame) {
        const password = await encrypt(params.password);
        return userDB.update({ password })
      } else {
        throw new BadRequestError({
          field: 'password',
          message: 'Password invalid'
        });
      }
    }
  };

  static adminUpdate = async (params: any, ctx: any) => {
    const { id, status } = params;

    return MySQLClient.transaction(async (transaction) => {
      const user = await Users.findOne({ where: { id }, transaction });

      if (!user) {
        throw new NotFoundError({ message: 'User not found', field: 'id' });
      }

      await Users.update({ status }, { where: { id }, transaction })

      return Users.findOne({ where: { id }, transaction });
    })

  }

  static list = async (params: any = {}, ctx: any = {}) => {
    const limit = parseInt(params.limit, 10) || DEFAULT_LIMIT;
    const offset = parseInt(params.offset, 10) || 0;

    const users = await Users.findAndCountAll({
      where: {
        isAdmin: {
          [MySQLClient.Op.ne]: 1
        }
      },
      raw: true,
      offset,
      limit,
      order: [['createdAt', 'desc']]
    });

    return users;
  };
}
