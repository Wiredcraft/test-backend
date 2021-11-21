import express from 'express';
import { list, getOne, create, update, destory } from '../services/members';

const router = express.Router();

router.get('/', list);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', destory);

export default router;
