import * as path from 'path';
import * as sequelize from 'sequelize';
import * as def from './db';

export interface ITables {
  Users: def.UsersModel;
}

let isInitialized = false;

export const getModels = (seq: sequelize.Sequelize): ITables => {
  const tables: ITables = {
    // Users friendly
    Users: seq.import(path.join(__dirname, "users")),

    // Third party data
  };

  if (!isInitialized) {
    isInitialized = true;
  }

  return tables;
};
