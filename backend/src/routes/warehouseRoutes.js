import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getNearestWarehouse } from '../controllers/warehouseController.js';

const router = Router();

// GET /api/v1/warehouse/nearest?sellerId=&productId=
router.get('/nearest', asyncHandler(getNearestWarehouse));

export default router;