import * as sequelize from 'sequelize';
import { DataTypes } from 'sequelize';
import { ProductsInstance, ProductsAttribute } from './db';

export default (sequelize: sequelize.Sequelize, DataTypes: DataTypes) => {
  return sequelize.define<ProductsInstance, ProductsAttribute>(
    'products',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      category: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id'
        }
      },
      price: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      priceAfterDiscount: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      brand: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 0
      },
      unit: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      pictures: {
        type: DataTypes.TEXT('long'),
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      titleVN: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      descriptionVN: {
        type: DataTypes.TEXT('long'),
        allowNull: false
      },
      titleEN: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      descriptionEN: {
        type: DataTypes.TEXT('long'),
        allowNull: false
      },
      nbViews: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      tableName: 'products'
    }
  );
};
