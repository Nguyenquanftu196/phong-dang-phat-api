import * as path from 'path';
import * as sequelize from 'sequelize';
import * as def from './db';

export interface ITables {
  Users: def.UsersModel;
  Products: def.ProductsModel;
  Categories: def.CategoriesModel;
  Carts: def.CartsModel;
}

let isInitialized = false;

export const getModels = (seq: sequelize.Sequelize): ITables => {
  const tables: ITables = {
    // Users friendly
    Users: seq.import(path.join(__dirname, "users")),
    Products: seq.import(path.join(__dirname, "products")),
    Categories: seq.import(path.join(__dirname, "categories")),
    Carts: seq.import(path.join(__dirname, 'carts'))
  };

  if (!isInitialized) {
    isInitialized = true;
  }

  return tables;
};
