import * as sequelize from 'sequelize';
import { DataTypes } from 'sequelize';
import { CategoriesInstance, CategoriesAttribute } from './db';

export default (sequelize: sequelize.Sequelize, DataTypes: DataTypes) => {
  return sequelize.define<CategoriesInstance, CategoriesAttribute>(
    'categories',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nameVN: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      nameEN: {
        type: DataTypes.STRING(255),
        allowNull: false
      }
    },
    {
      tableName: 'categories'
    }
  );
};
