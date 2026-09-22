import express from 'express';
import { getTables, updateTableStatus } from '../controllers/tableController.js';

const router = express.Router();

router.get('/', getTables);
router.put('/:tableNumber/status', updateTableStatus);

export default router;
