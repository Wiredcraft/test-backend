import Sequelize from 'sequelize';
import config from '../core/config';
import {
	join
} from 'path';
import {
	logger
} from '../core/logger';
import {
	dbLogger
} from '../core/db.logger';
import {
	map,
	mapKeys,
	camelCase
} from 'lodash';


const {
	mysql: {
		database,
		user,
		password,
		host,
		port = 3306,
		poolSize
	},
	databaseLogLevel = 0
} = config;

//1file log 0console
let logging = false;

if (databaseLogLevel) {
	logging = function (msg) {
		if (databaseLogLevel & 1) {
			console.info(msg);
		}
		if (databaseLogLevel & 2) {
			dbLogger.info(msg)
		}
	}
}

export let sequelize = new Sequelize(database, user, password, {
	host,
	port,
	dialect: 'mysql',
	dialectOptions: {
		decimalNumbers: true,
		supportBigNumbers: true
	},
	pool: {
		max: poolSize,
		min: 0,
		idle: 10000
	},
	timezone: '+08:00',
	logging,
	define: {
		underscored: true,
		underscoredAll: true
		// hooks: { //http://docs.sequelizejs.com/en/latest/docs/hooks/
		// 	beforeBulkCreate: function(rows) {
		// 		rows.forEach(function(row) {
		// 			if (typeof row.status == 'undefined' || row.status == null) {
		// 				row.status = 1;
		// 			}
		// 		});
		// 	},
		// 	beforeValidate: function(row) {
		// 		if (typeof row.status == 'undefined' || row.status == null) {
		// 			row.status = 1;
		// 		}
		// 	}
		// }
	}
});

sequelize.authenticate().catch(function (errors) {
	logger.info({
		type: "Mysql",
		err: errors
	});
});

export function renameKeys(data) {
	if (data.length) {
		data = map(data, function (item) {
			item = mapKeys(item, function (value, key) {
				return camelCase(key);
			});
			return item;
		});
	} else {
		data = mapKeys(data, function (value, key) {
			return camelCase(key);
		});

	}
	return data;
}

export const Op = Sequelize.Op;

export let User = sequelize.import(join(__dirname, './user'));
export let UserRelation = sequelize.import(join(__dirname, './user.relation'));

User.belongsToMany(User, {
	as: "flowers",
	through: {
		model: UserRelation
	},
	constraints: false,
	foreignKey: "userId",
	otherKey: "flowerId"
});