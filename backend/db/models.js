import { getSequelize } from './sequelize';
import { DataTypes } from 'sequelize';

const sequelize = getSequelize();

/*
 * Member model
 * {
 *   "id": "xxx",                  // user ID
 *   "name": "test",               // user name
 *   "dob": "",                    // date of birth
 *   "address": "",                // user address (note: with EPSG:4326)
 *   "description": "",            // user description
 *   "createdAt": ""               // user created date
 * }
 */
export const Member = sequelize.define(
  'members',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
    },
    name: {
      type: DataTypes.STRING,
    },
    dob: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.GEOMETRY('POINT', 4326), // Just save point here
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      field: 'created_at', // Best practice of PG/PL sql
      type: DataTypes.DATE, // TIMESTAMP WITH TIME ZONE for postgres
      allowNull: false,
    },
  },
  {
    freezeTableName: true, // Model tableName will be the same as the model name
    timestamps: false, // timestamps will now be false
    hooks: {
      beforeSave: function (instance) {
        // To force the CRS to 4326
        if (instance.address && !instance.address.crs) {
          instance.address.crs = {
            type: 'name',
            properties: {
              name: 'EPSG:4326',
            },
          };
        }
      },
    },
  }
);
