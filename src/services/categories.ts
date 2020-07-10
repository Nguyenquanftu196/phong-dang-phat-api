import { MySQLClient, Op } from '../clients/mysql';
import { getModels } from '../models/db.tables';
import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errors';
import { isEmpty } from 'lodash'

const { Categories } = getModels(MySQLClient);

export class CategoriesServices {

  static create = async (body: any, ctx: any) => {
    const { user } = ctx
    
    if (!user.isAdmin) {
      throw new BadRequestError({ message: 'User not admin', field: 'id' })
    }
    if (isEmpty(body) || body.nameVN === '') {
      throw new BadRequestError({ message: 'Category is require!', field: 'nameVN' })
    }
    if (isEmpty(body) || body.nameEN === '') {
      throw new BadRequestError({ message: 'Category is require!', field: 'nameEN' })
    }

    const res = await Categories.create(body)
    return res
  };

  static list = async (params: any, ctx: any) => {
    const { user } = ctx
    const limit = parseInt(params.limit, 10) || 25;
    const offset = parseInt(params.offset, 10) || 0;
    const query = params.q;

    let where: any = {};
    where[MySQLClient.Op.and] = []

    if (query) {
      where[MySQLClient.Op.and].push({
        nameVN: {
          [Op.like]: `%${query}%`
        }
      })
    }

    const res = await Categories.findAndCountAll({
      where,
      limit,
      raw: true,
      offset,
      order: [['nameVN', 'asc']],
    });

    return res
  }

  static update = async (id: any, body: any, ctx: any) => {
    const { user } = ctx

    if (!user.isAdmin) {
      throw new BadRequestError({ message: 'User not admin', field: 'id' })
    }

    if (isEmpty(body) || body.nameVN === '') {
      throw new BadRequestError({ message: 'Category is require!', field: 'nameVN' })
    }
    if (isEmpty(body) || body.nameEN === '') {
      throw new BadRequestError({ message: 'Category is require!', field: 'nameEN' })
    }
    const category = await Categories.findOne({ where: { id } })
    if (!category) {
      throw new BadRequestError({ message: 'Category not found!', field: 'id' })
    }

    await Categories.update(body, { where: { id } })
    const fetchCategory = await Categories.findOne({ where: { id } })

    return fetchCategory
  }

  static delete = async (id: any, ctx: any) => {
    const { user } = ctx

    if (!user.isAdmin) {
      throw new BadRequestError({ message: 'User not admin', field: 'id' })
    }

    const category = await Categories.findOne({ where: { id } })
    if (!category) {
      throw new BadRequestError({ message: 'Category not found!', field: 'id' })
    }

    return Categories.destroy({ where: { id } })
  }
}
