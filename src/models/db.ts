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

export interface UsersInstance extends Sequelize.Instance<UsersAttribute>, UsersAttribute { }
export interface UsersModel extends Sequelize.Model<UsersInstance, UsersAttribute> { }