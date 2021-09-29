import {
	Op,
    sequelize,
	User,
    UserRelation
} from '../models';
import user from '../models/user';

export async function transaction() {
	return sequelize.transaction();
}

export async function checkName(info) {
	let {
		name,
		excludeId
	} = info;
	let filter = {
		name: {
			[Op.eq]: name
		},
		status: {
			[Op.ne]: Status.Deleted
		}
	}
	if (excludeId) {
		filter.id = {
			[Op.ne]: excludeId
		}
	}
	let count = await User.count({
		where: filter
	});
	return count == 0 ? true : false
}

export async function create(info, options = {}) {
	let data = Object.assign({}, info, {
		updatedAt: new Date()
	});
	let item = await User.create(data, options);
	return item.id;
}

export async function pages(info) {
	let {
		pageIndex,
		pageSize,
		keywords,
		order,
		orderBy
	} = info;
	let count = 0;
	let condition = {
		status: {
			[Op.ne]: Status.Deleted
		}
	};

	if (keywords) {
		condition[Op.or] = [{
			name: {
				[Op.like]: '%' + keywords + '%'
			}
		}, {
			bid: {
				[Op.like]: '%' + keywords + '%'
			}
		}, {
			id: {
				[Op.like]: '%' + keywords + '%'
			}
		}]
	}

	let options = {
		where: condition,
        limit: pageSize,
		offset: (pageIndex - 1) * pageSize,
		order: [
			[orderBy, order],
			['id', 'desc']
		],
		subQuery: false,
		include: [{
			model: Category,
			as: "category",
			attributes: ['id', 'name']
		}],
	};
	let {
		count,
		rows
	} = await User.findAndCountAll(options);
	let users = [];
	if (count > 0 ) {
		for (let i = 0; i < rows.length; i++) {
			let item = rows[i];
			let refOptions = {
				where: {
					userId: item.id,
					status: Status.Normal
				},
				attributes: ["flower_id"],
			};
			let {
				flowersCount,
				relationsRows: rows
			} = await UserRelation.findAndCountAll(refOptions);
			let userIds = map(relationsRows, 'flower_id');
			let flowersOptions = {
				where: {
					id:  {
						[Op.in]: userIds
					},
					status: Status.Normal
				}
			};
			let flowers = await User.findAll(flowersOptions);
			let user = Object.assign({}, item, {
				flowersCount,
				flowers
			}); 
			users.push(user)
		}
	}
	return {
		count,
		users
	};
}

export async function list(info, ctx) {
	let {
		order,
		orderBy,
        keywords
	} = info;
	
	let filter = {
		status: {
			[Op.ne]: Status.Deleted,
		}
	};
    if (keywords) {
		filter[Op.or] = [{
			name: {
				[Op.like]: '%' + keywords + '%'
			}
		}, {
			bid: {
				[Op.like]: '%' + keywords + '%'
			}
		}, {
			id: {
				[Op.like]: '%' + keywords + '%'
			}
		}]
	}
	let condition = Object.assign({}, filter, {
		where: filter,
		order: [
			[orderBy, order],
			['id', 'desc']
		]
	})
	let list = await User.findAll(condition);
	let users = [];
	if (list.length > 0 ) {
		for (let i = 0; i < list.length; i++) {
			let item = list[i];
			let refOptions = {
				where: {
					userId: item.id,
					status: Status.Normal
				},
				attributes: ["flower_id"],
			};
			let {
				flowersCount,
				rows
			} = await UserRelation.findAndCountAll(refOptions);
			let userIds = map(rows, 'flower_id');
			let flowersOptions = {
				where: {
					id:  {
						[Op.in]: userIds
					},
					status: Status.Normal
				}
			};
			let flowers = await User.findAll(flowersOptions);
			let user = Object.assign({}, item, {
				flowersCount,
				flowers
			}); 
			users.push(user)
		}
	}
	return {
		users
	};
}

export async function query(info, options = {}) {
	let {
		id,
		name
	} = info;

	let filter = {};
	if (id) {
		filter = {
			status: {
				[Op.ne]: Status.Deleted
			},
			id
		};
	} else if (name) {
		filter = {
			status: {
				[Op.ne]: Status.Deleted
			},
			name
		};
	} 

	let condition = Object.assign({}, options, {
		where: filter,
	});
	let item = await User.findOne(condition);
	if (item) {
		let refOptions = {
			where: {
				userId: id,
				status: Status.Normal
			},
            attributes: ["flower_id"],
		};
		let {
            flowersCount,
            rows
        } = await UserRelation.findAndCountAll(refOptions);
        let userIds = map(rows, 'flower_id');
        let flowersOptions = {
			where: {
				id:  {
                    [Op.in]: userIds
                },
				status: Status.Normal
			}
		};
        let flowers = await User.findAll(flowersOptions);
		if (item.dataValues) {
			Object.assign(item.dataValues, {
                flowers,
				flowersCount
			});
		} else {
			Object.assign(item, {
                flowers,
				flowersCount
			});
		}
	}

	return item;
}

export async function update(info, options = {}) {
    let {
		id
	} = info;
    delete info.id;
	let data = Object.assign({}, info, {
		updatedAt: new Date()
	});
	await User.update(data, options);
	return id;
}

export async function remove(info, options = {}) {
    let {
        id,
        updatedBy
    } = info;
	options = Object.assign({}, options, {
		where: {
			id,
			status: {
				[Op.ne]: Status.Deleted
			}
		}
	});
	let [affectedCount] = await User.update({
		status: Status.Deleted,
		updatedBy
	}, options);
	
	return affectedCount;
}

export async function nearBy(distance, userInfo) {
	let {
        address: {
			lng,
			lat
		}
    } = userInfo; 
	//1 获取外切正方形最大最小经纬度
	let {
		minlng, 
		maxlng, 
		minlat, 
		maxlat
	} = getGpsRange(lng, lat, distance);
	//2 获取位置在正方形内的所有用户
	let users = [];
	let allUsers = await User.findAll({
        where: {
			status: {
				[Op.ne]: Status.Deleted
			},
        }
    });
	if (allUsers.length) {
        for (let i = 0; i < allUsers.length; i++) {
			let user = allUsers[i];
            let {
                lng,
                lat
            } = address;
            if (lng >= minlng && lng <= maxlng && lat >= minlat && lat <= maxlat) {
               users.push(user)
            }
        }
    };
	
	//3 过滤掉超过指定距离的用户
	users = users.filter(item => {
		let {
			address: {
				lng,
				lat
			}
		} = item;
		return getDistance(lng, lat, userLng, userLat) <= distance ? true: false;
	})
	return users;
}

async function getGpsRange(lng, lat, rangeDistances) {
	//半矢量公式，与圆心在同纬度上，且在圆周上的点到圆点的经度差	
	let  dlng = 2 * Math.asin(Math.sin(rangeDistances / (2 * EARTH_RADIUS)) / Math.cos(lat * Math.PI / 180));	
	//弧度转为角度	
	dlng = dlng * 180 / Math.PI;
	//半矢量公式，与圆心在同经度上，且在圆周上的点到圆点的纬度差
	let dlat = rangeDistances / EARTH_RADIUS;
	//弧度转为角度
	dlat = dlat * 180 / Math.PI;
	let minlng = lng - dlng;
	let maxlng = lng + dlng;
	let minlat = lat - dlat;
	let maxlat = lat + dlat;	
	return {
		minlng, 
		maxlng, 
		minlat, 
		maxlat
	};	
}

/**
* @param lng1 坐标1经度
* @param lat1 坐标1纬度
* @param ln2 坐标 经度
* @param lat2 坐标2纬度
* @return 返回km
*/

async function getDistance(lng1, lat1, ln2, lat2) {
	let radLat1 = Math.toDegrees(lat1);
	let radLat2 = Math.toDegrees(lat2);	
	let a = radLat1 - radLat2;	
	let b = Math.toDegrees(lng1) - Math.toDegrees(ln2);	
	let distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +	
	Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));	
	distance = distance * EARTH_RADIUS;	
	distance = Math.round(distance * 10000) / 10000.0;	
	return distance;	
}
