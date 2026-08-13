import { Router } from 'express';
import * as cardController from '../controllers/cardController.js';

const router = Router();

router.get('/sets/list', cardController.getSets);
router.get('/', cardController.searchCards);
router.get('/:id', cardController.getCardById);

export default router;
