import * as schemas from './validation.schemas';
import {
	validateHelper,
} from '../util/helper';

export const create = validateHelper({
	body: schemas.create
});

export const list = validateHelper({
	query: schemas.list
});

export const pages = validateHelper({
	query: schemas.pages
});

export const update = validateHelper({
	body: schemas.create
});
