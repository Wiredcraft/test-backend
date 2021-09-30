import {
	wrapBody as wrap,
} from '../util/helper';
import * as service from './service';
import errors from '../core/errors';
import {
	trim,
	startsWith, 
} from 'lodash';
import { User } from '../models';

export async function create(ctx, next) {
    let data = null;
    let error = null;
    let transaction;
	try {
        transaction = await service.transaction();
		let options = {
			transaction: transaction
		};
		let body = ctx.request.body;
		let {
			name
		} = body;
		name = trim(name);
		let nameAvailable = await service.checkName({
			name
		});
		if (!nameAvailable) {
			throw new errors.UserNameConflict();
		}
		let {
			id: userId
		} = ctx.state.user;
		let info = Object.assign({}, body, {
			name,
			createdUserId: userId,
			updatedUserId: userId,
        });
		data = await service.create(info, options);
        await transaction.commit();
	} catch (ex) {
        if (transaction && transaction.rollback) {
			await transaction.rollback();
		}
		return ctx.body = wrap(ex);
	}
	ctx.body = wrap(error, data);
}

export async function list(ctx, next) {
	let data = null;
	let error = null;
	try {
		let query = ctx.query;
		let {
            keywords,
			sort,
            order = 'DESC',
			orderBy = 'createdAt',
		} = query;
		if (sort) {
			if (startsWith(sort, "-")) {
				order = "DESC"
			} else {
				order = "ASC"
			}
			orderBy = sort.replace(/^[\+-]/, "");
		}
		data = await service.list({
            keywords,
			order,
			orderBy,
			query
		});
	} catch (ex) {
		return ctx.body = wrap(ex);
	}
	ctx.body = wrap(error, data);
}

export async function pages(ctx, next) {
	let data = null;
	let error = null;
	try {
		let {
			pageIndex = 1,
			pageSize = 10,
			keywords,
			sort,
			order = 'DESC',
			orderBy = 'createdAt',
		} = ctx.query;
		pageIndex = pageIndex * 1;
		pageSize = pageSize * 1;
		if (sort) {
			if (startsWith(sort, "-")) {
				order = "DESC"
			} else {
				order = "ASC"
			}
			orderBy = sort.replace(/^[\+-]/, "");
		}
		let info = {
			pageIndex,
			pageSize,
			keywords,
			order,
			orderBy
		};
		let {
            count: total,
			rows: users
		} = await service.pages(info);
        data = {
            total,
			users,
			pageSize,
			pageIndex,
		};
	} catch (ex) {
		return ctx.body = wrap(ex);
	}
	ctx.body = wrap(error, data);
}

export async function query(ctx, next) {
	let data = null;
	let error = null;
	try {
		let {
			id
		} = ctx.params;
		let info = {
			id
		}
		data = await service.query(info);
	} catch (ex) {
		return ctx.body = wrap(ex);
	}
	ctx.body = wrap(error, data);
}

export async function update(ctx, next) {
	let data = null;
	let error = null;
	let transaction;
	try {
		transaction = await service.transaction();
		let body = ctx.request.body;
		let {
			id
		} = ctx.params;
		let {
			name
		} = body;
		name = trim(name);
		let queryInfo = {
			id
		};
		let existItem = await service.query(queryInfo);
		if (!existItem) {
			throw new errors.UserNotExists();
		}
		let {
			createdAt,
			createdUserId
		} = existItem;

		let nameAvailable = await service.checkName({
			name,
			excludeId: id
		});
		if (!nameAvailable) {
			throw new errors.UserNameConflict();
		}
		let {
			id: userId
		} = ctx.state.user;

		let metaInfo = {
			id,
			name,
			createdAt,
			createdBy: createdUserId,
			updatedBy: userId,
		};
        let options = {
            where: {
                id
            },
			transaction: transaction
		};
		let info = Object.assign({}, metaInfo, body);
		data = await service.update(info, options);
		await transaction.commit();
	} catch (ex) {
		if (transaction && transaction.rollback) {
			await transaction.rollback();
		}
		return ctx.body = wrap(ex);
	}
	ctx.body = wrap(error, data);
}

export async function remove(ctx, next) {
	let data = null;
	let error = null;
	let transaction;
	try {
		transaction = await service.transaction();
		let {
			id
		} = ctx.params;
        let {
			id: userId
		} = ctx.state.user;
        let metaInfo = {
			id,
			updatedBy: userId,
		};
        let options = {
			transaction: transaction
		};
		await service.remove(metaInfo, options);
		await transaction.commit();
	} catch (ex) {
		if (transaction && transaction.rollback) {
			await transaction.rollback();
		}
		return ctx.body = wrap(ex);
	}
	ctx.body = wrap(error, data);
}

export async function checkName(ctx, next) {
	let data = null;
	let error = null;
	try {
		let {
            name
        } = ctx.query;
		name = trim(name);
		data = await service.checkName({
			name
		});
	} catch (ex) {
		return ctx.body = wrap(ex);
	}
	ctx.body = wrap(error, data);
}

export async function nearBy(ctx, next) {
	let data = null;
	let error = null;
	try {
		let {
			name,
			distance
		} = ctx.query;
		let condition = {
			name
		};
		let user = await service.query(condition);
		data = await service.nearBy(distance, user);
	} catch (ex) {
		return ctx.body = wrap(ex);
	}
	ctx.body = wrap(error, data);
}
