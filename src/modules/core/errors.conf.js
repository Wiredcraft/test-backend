'use strict';

let consts = {};

//系统级别
consts.ProgramerException = {
	code: "E300",
	message: "系统程序执行错误"
};

consts.ParamsInvalid = {
	code: "E302",
	message: "数据验证失败"
};

consts.DataIsNull = {
	code: "E303",
	message: "数据为空"
};

consts.DataException = {
	code: "E304",
	message: "数据异常"
};

consts.UrlInvalid = {
	code: "E305",
	message: "非法url"
};

consts.Api = [{
	name: "NoRight",
	code: "E35001",
	message: "无权限"
}];


consts.User = [{
	name: "NameConflict",
	code: "E61001",
	message: "名称重复"
}, {
	name: "NotExists",
	code: "E61002",
	message: "用户不存在"
}];

export default consts
