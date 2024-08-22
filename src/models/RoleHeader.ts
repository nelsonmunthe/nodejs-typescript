import {  DataTypes, Optional, ModelDefined } from 'sequelize';
import database from "../config/config"

interface RoleHeaderAttributes {
    id: number;
    name: string;
    status: boolean;
    created_by: string;
    updated_by: string;
    createdAt: Date;
    updatedAt: Date; 
}

type RoleHeaderCreationAttributes = Optional<RoleHeaderAttributes, 'id'>;

const RoleHeaderModel: ModelDefined<
  RoleHeaderAttributes,
  RoleHeaderCreationAttributes
> = database.define(
  'ms_roles_revamp',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status : {
      type: DataTypes.BOOLEAN
    },
    created_by: {
      type: DataTypes.STRING
    },
    updated_by: {
      type: DataTypes.STRING
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'ms_roles_revamp'
  }
);


export default RoleHeaderModel