import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getCustomers, postCustomer } from '../controllers/customerController.js';

const router = Router();

router.get('/', asyncHandler(getCustomers));
router.post('/', asyncHandler(postCustomer));

export default router;

