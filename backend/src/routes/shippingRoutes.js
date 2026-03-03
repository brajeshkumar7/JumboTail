import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getShippingCharge } from '../controllers/shippingController.js';

const router = Router();

// GET /api/v1/shipping-charge?warehouseId=&customerId=&productId=&quantity=&deliverySpeed=
router.get('/', asyncHandler(getShippingCharge));

export default router;