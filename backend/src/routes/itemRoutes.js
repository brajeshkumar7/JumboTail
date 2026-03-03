import { Router } from 'express';
import * as itemController from '../controllers/itemController.js';

const router = Router();

router.get('/', itemController.getItems);
router.get('/:id', itemController.getItem);
router.post('/', itemController.createItem);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

export default router;
