import * as sequelize from 'sequelize';
import { DataTypes } from 'sequelize';
import { CartsInstance, CartsAttribute } from './db';

export default (sequelize: sequelize.Sequelize, DataTypes: DataTypes) => {
  return sequelize.define<CartsInstance, CartsAttribute>(
    'carts',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'DRAFT'
      },
      completedOn: {
        type: DataTypes.TIME,
        allowNull: true
      },
      cartItems: {
        type: DataTypes.TEXT('long'),
        allowNull: false
      },
      buyerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      shippingName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      shippingAddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      shippingCity: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      shippingCountry: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      shippingPhone: {
        type: DataTypes.STRING(255),
        allowNull: false,
      }
    },
    {
      tableName: 'carts'
    }
  );
};
