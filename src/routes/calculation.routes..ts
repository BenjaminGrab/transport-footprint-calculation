import { Router } from 'express';
import { getFootprint } from '../controllers/calculation.controller';

const router = Router();

router.post('/calculate', getFootprint);

export default router;
