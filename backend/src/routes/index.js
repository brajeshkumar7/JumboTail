import { Router } from 'express';
import itemRoutes from './itemRoutes.js';

const router = Router();

router.use('/items', itemRoutes);

export default router;
