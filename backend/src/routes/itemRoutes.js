import { Router } from 'express';
import * as itemController from '../controllers/itemController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(itemController.getItems));
router.get('/:id', asyncHandler(itemController.getItem));
router.post('/', asyncHandler(itemController.createItem));
router.put('/:id', asyncHandler(itemController.updateItem));
router.delete('/:id', asyncHandler(itemController.deleteItem));

export default router;
