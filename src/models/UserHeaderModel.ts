import {  DataTypes, Optional, ModelDefined } from 'sequelize';
import database from "../config/config"
import RoleHeaderModel from './RoleHeader';

interface UserHeaderAttributes {
    id: number;
    username: string;
    password: string;
    role_id: number;
    status: boolean;
    viewer: boolean;
    last_login: Date;
    created_by: string;
    updated_by: string;
    createdAt: Date;
    updatedAt: Date; 
}

type UserHeaderCreationAttributes = Optional<UserHeaderAttributes, 'id'>;

const UserHeaderModel: ModelDefined<
  UserHeaderAttributes,
  UserHeaderCreationAttributes
> = database.define(
  'ms_user_revamp',
  {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    viewer: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    last_login: {
        type: DataTypes.DATE
    },
    created_by: {
        type: DataTypes.STRING
    },
    updated_by: {
        type: DataTypes.STRING
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
      },
  },
  {
    tableName: 'ms_user_revamp'
  }
);

UserHeaderModel.belongsTo(RoleHeaderModel, {foreignKey: 'role_id', as: 'role'})
export default UserHeaderModel