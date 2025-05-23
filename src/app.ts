import express from 'express';
import calculationRoutes from './routes/calculation.routes.';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware';

const app = express();

app.use(express.json());

app.use('/', calculationRoutes);

app.use(errorHandlerMiddleware);

export default app;
