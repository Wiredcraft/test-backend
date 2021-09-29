import Joi from 'joi';

export let create = Joi.object().keys({
	name: Joi.string().max(64).required(),
    dob: Joi().date().required(),
	parameter: Joi.when("type", {
		is: 1,
		then: Joi.object().keys({
			"lat": Joi.number().required(),
			"lng": Joi.number().required(),
			
		}).required()
	}),
	description: Joi.string().max(256).allow(["", null]),
    createdBy: Joi.string().allow(["", null]),
    updatedBy: Joi.string().allow(["", null]),
    status: Joi.string().allow(["", null]),
});

export let list = Joi.object().keys({
	keyword: Joi.string().min(1).max(30).allow("", null),
	sort: Joi.string().allow("", null),
	order: Joi.string().allow("", null),
	orderBy: Joi.string().allow("", null),
	status: Joi.string().allow("", null),
});

export let pages = Joi.object().keys({
	pageIndex: Joi.number().integer().min(1).required(),
	pageSize: Joi.number().integer().min(5).max(100).required(),
	keywords: Joi.string().min(1).max(30).allow("", null),
	sort: Joi.string().allow("", null),
	order: Joi.string().allow("", null),
	orderBy: Joi.string().allow("", null),
	status: Joi.string().allow("", null),
});
