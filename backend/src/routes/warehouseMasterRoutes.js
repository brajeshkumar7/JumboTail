import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getWarehouses, postWarehouse } from '../controllers/warehouseMasterController.js';

const router = Router();

router.get('/', asyncHandler(getWarehouses));
router.post('/', asyncHandler(postWarehouse));

export default router;

