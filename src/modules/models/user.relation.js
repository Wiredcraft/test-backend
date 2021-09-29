module.exports = function(sequelize, DataTypes) {
    return sequelize.define('UserRelation', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            field: "id"
        },
        userId: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            defaultValue: null,
            field: "user_id"
        },
        flowerId: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            defaultValue: null,
            field: "flower_id"
        }
    }, {
        tableName: 'user_relation',
        timestamps: false
    });
};