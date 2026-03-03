import { Router } from 'express';
import warehouseRoutes from './warehouseRoutes.js';
import shippingRoutes from './shippingRoutes.js';
import sellerRoutes from './sellerRoutes.js';
import customerRoutes from './customerRoutes.js';
import productRoutes from './productRoutes.js';
import warehouseMasterRoutes from './warehouseMasterRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ ok: true });
});

router.use('/v1/warehouse', warehouseRoutes);
router.use('/v1/shipping-charge', shippingRoutes);
router.use('/v1/sellers', sellerRoutes);
router.use('/v1/customers', customerRoutes);
router.use('/v1/products', productRoutes);
router.use('/v1/warehouses', warehouseMasterRoutes);

export default router;
