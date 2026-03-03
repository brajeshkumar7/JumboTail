import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getSellers, postSeller } from '../controllers/sellerController.js';

const router = Router();

router.get('/', asyncHandler(getSellers));
router.post('/', asyncHandler(postSeller));

export default router;

