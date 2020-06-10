import { Sequelize } from 'sequelize-typescript';

const upQuery = `SELECT 1 AS result`;

const downQuery = `SELECT -1 AS result`;

const up = async (sequelize: Sequelize) => {
  await sequelize.query(upQuery);
};

const down = async (sequelize: Sequelize) => {
  await sequelize.query(downQuery);
};

export { up, down };
