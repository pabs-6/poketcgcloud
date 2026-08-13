import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import * as wishlistController from '../controllers/wishlistController.js';

const router = Router();

router.use(authenticate);

router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.post('/:cardId/move', wishlistController.moveToCollection);
router.delete('/:cardId', wishlistController.removeFromWishlist);

export default router;
