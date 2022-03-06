module.exports = (app) => {
  const { STRING, DATE, FLOAT, INTEGER } = app.Sequelize;

  const User = app.model.define(
    'tbl_users',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'id, primary key, auto increment'
      },
      name: {
        field: 'name',
        type: STRING(32),
        allowNull: false,
        unique: false,
        comment: 'username'
      },
      pwd: {
        field: 'pwd',
        type: STRING(100),
        allowNull: false,
        unique: false,
        comment: 'password'
      },
      dob: {
        field: 'dob',
        type: DATE,
        allowNull: true,
        unique: false,
        comment: 'date of birth'
      },
      address: {
        field: 'address',
        type: STRING(200),
        allowNull: true,
        unique: false,
        defaultValue: '',
        comment: 'address'
      },
      description: {
        field: 'description',
        type: STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: '角色'
      },
      latitude: {
        field: 'latitude',
        type: FLOAT,
        allowNull: false,
        defaultValue: 0,
        comment: 'latitude'
      },
      longitude: {
        field: 'longitude',
        type: FLOAT,
        allowNull: false,
        defaultValue: 0,
        comment: 'longitude'
      },
      createdAt: {
        field: 'created_at',
        type: DATE,
        allowNull: true,
        comment: 'create time'
      },
      updatedAt: {
        field: 'updated_at',
        type: DATE,
        allowNull: true,
        comment: 'update time'
      },
      deletedAt: {
        field: 'deleted_at',
        type: DATE,
        allowNull: true,
        comment: 'delete time'
      }
    },
    {
      timestamps: false
    }
  );

  return User;
};
