import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import * as statsController from '../controllers/statsController.js';

const router = Router();

router.use(authenticate);
router.get('/', statsController.getStats);

export default router;
