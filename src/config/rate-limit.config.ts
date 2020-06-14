import * as rateLimit from "express-rate-limit";

export default () => {
	return rateLimit( {
		windowMs: 15 * 60 * 1000,
		max: 100
	} );
}
