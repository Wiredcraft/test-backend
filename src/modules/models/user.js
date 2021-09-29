module.exports = function(sequelize, DataTypes) {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            field: "id"
        },
        name: {
            type: DataTypes.STRING(64),
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            defaultValue: null,
            field: "name"
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            defaultValue: null,
            field: "dob"
        },
        address: {
            type: DataTypes.JSON,
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            defaultValue: null,
            field: "address"
        },
        description: {
            type: DataTypes.STRING(256),
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            defaultValue: null,
            field: "description"
        },
        createdBy: {
            type: DataTypes.STRING(11),
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            defaultValue: null,
            field: "createdBy"
        },
        updatedBy: {
            type: DataTypes.STRING(11),
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            defaultValue: null,
            field: "updatedBy"
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            defaultValue: null,
            field: "createdAt"
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            defaultValue: null,
            field: "updatedAt"
        },
        status: {
            type: DataTypes.INTEGER(2).UNSIGNED,
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            defaultValue: 1,
            field: "status"
        }
    }, {
        tableName: 'user',
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    });
};
