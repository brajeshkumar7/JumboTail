import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getProducts, postProduct } from '../controllers/productController.js';

const router = Router();

router.get('/', asyncHandler(getProducts));
router.post('/', asyncHandler(postProduct));

export default router;

