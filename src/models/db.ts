import * as Sequelize from 'sequelize';

export interface UsersAttribute {
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  status?: string;
  teamId?: number;
  contractNumber?: number;
  contractExpDate?: string;
  isAdmin?: boolean;
}

export interface ProductsAttribute {
  id?: number;
  category?: number;
  price?: number;
  priceAfterDiscount?: number;
  brand?: string;
  unit?: string;
  pictures?: string;
  quantity?: number;
  titleVN?: string;
  descriptionVN?: string;
  titleEN?: string;
  descriptionEN?: string;
  nbViews?: number;
}

export interface CategoriesAttribute {
  id?: number;
  nameVN?: string;
  nameEN?: string;
}

export interface CartsAttribute {
  id?: number;
  amount?: number;
  status?: string;
  completedOn?: string;
  cartItems?: string;
  buyerId?: number;
  shippingName?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingCountry?: string;
  shippingPhone?: string;
}

export interface UsersInstance extends Sequelize.Instance<UsersAttribute>, UsersAttribute { }
export interface UsersModel extends Sequelize.Model<UsersInstance, UsersAttribute> { }

export interface ProductsInstance extends Sequelize.Instance<ProductsAttribute>, ProductsAttribute { }
export interface ProductsModel extends Sequelize.Model<ProductsInstance, ProductsAttribute> { }

export interface CategoriesInstance extends Sequelize.Instance<CategoriesAttribute>, CategoriesAttribute { }
export interface CategoriesModel extends Sequelize.Model<CategoriesInstance, CategoriesAttribute> { }

export interface CartsInstance extends Sequelize.Instance<CartsAttribute>, CartsAttribute { }
export interface CartsModel extends Sequelize.Model<CartsInstance, CartsAttribute> { }