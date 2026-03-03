import { Router } from 'express';
import itemRoutes from './itemRoutes.js';
import warehouseRoutes from './warehouseRoutes.js';
import shippingRoutes from './shippingRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ ok: true });
});

router.use('/v1/warehouse', warehouseRoutes);
router.use('/v1/shipping-charge', shippingRoutes);
router.use('/items', itemRoutes);

export default router;
