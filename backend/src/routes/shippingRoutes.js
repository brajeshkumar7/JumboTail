import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getShippingCharge, calculateShippingForSeller } from '../controllers/shippingController.js';

const router = Router();

// GET /api/v1/shipping-charge?warehouseId=&customerId=&productId=&quantity=&deliverySpeed=
router.get('/', asyncHandler(getShippingCharge));

// POST /api/v1/shipping-charge/calculate
router.post('/calculate', asyncHandler(calculateShippingForSeller));

export default router;