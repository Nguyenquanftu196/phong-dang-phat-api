import Sequelize from 'sequelize';

export const { Op } = Sequelize;
export const MySQLClient = new Sequelize(
  process.env.DB_NAME || '',
  process.env.DB_USER || '',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '',
    port: parseInt(process.env.DB_PORT || '', 10) || 3306,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: { decimalNumbers: true, multipleStatements: true },
    logging: false, //console.log,
    operatorsAliases: false,
    timezone: '+07:00'
  }
);