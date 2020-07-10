import { MySQLClient, Op } from '../clients/mysql';
import { getModels } from '../models/db.tables';
import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errors';
import { isEmpty, isNull, pick, forEach, find } from 'lodash'

const { Products, Categories, Users } = getModels(MySQLClient);

const PRODUCT_CREATE_FIELDS = [
  'category',
  'price',
  'priceAfterDiscount',
  'brand',
  'unit',
  'pictures',
  'quantity',
  'titleVN',
  'descriptionVN',
  'titleEN',
  'descriptionEN'
]

export class ProductsServices {
  static validProduct = (body: any) => {
    if (body.category === '') {
      throw new BadRequestError({ message: 'Category is require', field: 'category' })
    }
    if (isNull(body.price) || body.price < 0) {
      throw new BadRequestError({ message: 'Price must bigger 0', field: 'price' })
    }
    if (body.priceAfterDiscount < 0) {
      throw new BadRequestError({ message: 'Price after discount must bigger 0', field: 'priceAfterDiscount' })
    }
    if (body.priceAfterDiscount > body.price) {
      throw new BadRequestError({ message: 'Price must bigger price after discount', field: 'price' })
    }
    if (body.brand === '') {
      throw new BadRequestError({ message: 'Brand is require', field: 'brand' })
    }
    if (body.unit === '') {
      throw new BadRequestError({ message: 'Unit is require', field: 'unit' })
    }
    if (body.pictures.length < 1) {
      throw new BadRequestError({ message: 'Picture of product is require', field: 'picture' })
    }
    if (body.quantity < 1) {
      throw new BadRequestError({ message: 'Quantity must bigger 0', field: 'quantity' })
    }
    if (body.titleVN === '') {
      throw new BadRequestError({ message: 'TitleVN is require', field: 'titleVN' })
    }
    if (body.descriptionVN === '') {
      throw new BadRequestError({ message: 'DescriptionVN is require', field: 'descriptionVN' })
    }
    if (body.titleEN === '') {
      throw new BadRequestError({ message: 'TitleEN is require', field: 'titleEN' })
    }
    if (body.descriptionEN === '') {
      throw new BadRequestError({ message: 'DescriptionEN is require', field: 'descriptionEN' })
    }
  }

  static create = async (body: any, ctx: any) => {
    try {
      const { user } = ctx

      if (!user.isAdmin) {
        throw new BadRequestError({ message: 'User not admin', field: 'id' })
      }
      ProductsServices.validProduct(body)

      const payload = pick(body, PRODUCT_CREATE_FIELDS)
      payload.pictures = JSON.stringify(payload.pictures)

      const product = await Products.create(payload)

      return product
    } catch (error) {
      throw error
    }
  }

  static list = async (params: any, ctx: any) => {
    try {
      const limit = parseInt(params.limit, 10) || 25;
      const offset = parseInt(params.offset, 10) || 0;
      const query = params.q;
      const { category } = params
      let where: any = {};
      where[MySQLClient.Op.and] = []

      if (category) {
        where[MySQLClient.Op.and].push({ category })
      }

      if (query) {
        where[MySQLClient.Op.and].push({
          [Op.or]: [
            {
              titleVN: { [Op.like]: `%${query}%` },
            },
            {
              descriptionVN: { [Op.like]: `%${query}%` },
            },
            {
              titleEN: { [Op.like]: `%${query}%` },
            },
            {
              descriptionEN: { [Op.like]: `%${query}%` },
            },
          ],
        });
      }

      // Categories.hasMany(Products, {foreignKey: 'id'})
      // Products.belongsTo(Categories, { foreignKey: 'id' })
      // Products.hasMany(Categories, { foreignKey: 'id' })

      const products: any = await Products.findAndCountAll({
        where,
        limit,
        offset,
        raw: true
      })

      const categories = await Categories.findAndCountAll({ raw: true })
      forEach(products.rows, product => {
        const category = find(categories.rows, { id: product.category })
        product.categoryName = (!category) ? '' : { nameVN: category.nameVN, nameEN: category.nameEN }
      })

      return products
    } catch (error) {
      throw error
    }
  }

  static fetch = async (id: any, ctx: any) => {
    const { user } = ctx

    if (!user.isAdmin) {
      throw new BadRequestError({ message: 'User not admin', field: 'id' })
    }
    const product: any = await Products.findOne({ where: { id }, raw: true })
    if (!product) {
      throw new BadRequestError({ message: 'Product not found', field: 'id' })
    }

    const category = await Categories.findOne({ where: { id: product.category }, raw: true })
    product.categoryName = (!category) ? {} : { nameVn: category.nameVN, nameEN: category.nameEN }

    return product
  }

  static delete = async (id: any, ctx: any) => {
    const { user } = ctx

    if (!user.isAdmin) {
      throw new BadRequestError({ message: 'User not admin', field: 'id' })
    }

    return MySQLClient.transaction(async (transaction) => {
      const userExist = await Users.findOne({ where: { id: user.id }, transaction })
      if (!userExist) {
        throw new NotFoundError({ message: 'User not found', field: 'id' });
      }

      const product = await Products.findOne({ where: { id }, transaction })
      if (!product) {
        throw new NotFoundError({ message: 'Product not found', field: 'id' });
      }

      return product.destroy({ transaction })
    })
  }

  static edit = async (id: any, body: any, ctx: any) => MySQLClient.transaction(async (transaction) => {
    const { user } = ctx

    if (!user.isAdmin) {
      throw new BadRequestError({ message: 'User not admin', field: 'id' })
    }
    ProductsServices.validProduct(body)
    const product = await Products.findOne({ where: { id }, transaction })
    if (!product) {
      throw new BadRequestError({ message: 'Product not found!', field: 'id' })
    }
    const payload = pick(body, PRODUCT_CREATE_FIELDS)
    payload.pictures = JSON.stringify(payload.pictures)

    const productUpdate = await product.update(payload, { transaction })
    const result: any = productUpdate.get({ plain: true })
    return result
  })

  static viewAd = async (id: any, ctx: any) => MySQLClient.transaction(async (transaction) => {
    const product = await Products.findOne({ where: { id }, transaction })
    if (!product) {
      throw new NotFoundError({ message: 'Product not found', field: 'id' });
    }

    const productUpdate = await product.update({ nbViews: product.nbViews + 1 }, { transaction })
    const result: any = productUpdate.get({ plain: true })
    const category = await Categories.findOne({ where: { id: product.category }, raw: true })
    result.categoryName = (!category) ? {} : { nameVN: category.nameVN, nameEN: category.nameEN }

    return result
  })
}
