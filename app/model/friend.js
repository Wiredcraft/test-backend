module.exports = (app) => {
  const { DATE, INTEGER } = app.Sequelize;

  const Friend = app.model.define(
    'tbl_friends',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'id, primary key, auto increment'
      },
      following: {
        field: 'following',
        type: INTEGER(11),
        allowNull: false,
        unique: false,
        comment: 'the person who follow another person'
      },
      follower: {
        field: 'follower',
        type: INTEGER(11),
        allowNull: false,
        unique: false,
        comment: 'the person be followed'
      },
      createdAt: {
        field: 'created_at',
        type: DATE,
        allowNull: true,
        comment: 'create time'
      }
    },
    {
      timestamps: false
    }
  );

  return Friend;
};
