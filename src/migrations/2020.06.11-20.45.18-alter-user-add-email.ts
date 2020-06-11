import { Sequelize, DataType } from 'sequelize-typescript';

const up = async (sequelize: Sequelize) => {
  const queryInterface = sequelize.getQueryInterface();
  const options = {
    type: DataType.STRING(32),
    allowNull: false,
    defaultValue: '',
    unique: true,
    after: 'id',
  };
  await queryInterface.addColumn('user', 'email', options);
};

const down = async (sequelize: Sequelize) => {
  const queryInterface = sequelize.getQueryInterface();
  await queryInterface.removeColumn('user', 'email');
};

export { up, down };
