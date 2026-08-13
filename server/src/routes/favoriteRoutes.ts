import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import * as favoriteController from '../controllers/favoriteController.js';

const router = Router();

router.use(authenticate);

router.get('/', favoriteController.getFavorites);
router.post('/', favoriteController.addFavorite);
router.delete('/:cardId', favoriteController.removeFavorite);

export default router;
