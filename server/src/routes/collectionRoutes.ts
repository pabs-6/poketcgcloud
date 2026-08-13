import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import * as collectionController from '../controllers/collectionController.js';

const router = Router();

router.use(authenticate);

router.get('/', collectionController.getCollection);
router.post('/', collectionController.addToCollection);
router.put('/:id', collectionController.updateCollectionItem);
router.delete('/:id', collectionController.removeFromCollection);

export default router;
