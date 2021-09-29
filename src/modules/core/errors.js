import conf from "./errors.conf";
import util from "util";
import _ from "lodash";

let defineError = function(name, code, defaultMessage) {
	defaultMessage = defaultMessage || "发生错误"
	let SelfError = function(message) {
		Error.captureStackTrace(this, this.constructor);
		this.name = name;
		this.code = code;
		this.message = message || defaultMessage;
	}
	util.inherits(SelfError, Error);
	return SelfError;
}

function confToError(conf) {
	let errors = {};
	for (let k in conf) {
		let item = conf[k];
		if (_.isArray(item)) {
			for (let i = 0; i < item.length; i++) {
				let subItem = item[i];
				let name = k + subItem.name;
				errors[name] = defineError(name, subItem.code, subItem.message);
			}
		} else if (_.isObject(item)) {
			let name = k;
			errors[name] = defineError(name, item.code, item.message);
		}
	}
	return errors;
}

let errors = confToError(conf);

errors.defineError = defineError;

export default errors;