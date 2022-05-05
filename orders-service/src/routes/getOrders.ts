import express, { Request, Response, Router } from 'express';
import { checkAuth } from '@gearthlogic/common';

import { Order } from '../Models/Order';

const router = express.Router();

router.get(
    '/api/orders',
    checkAuth,
    async (req: Request, res: Response) => {
        const orders = await Order.find({userId: req.user!.id}).populate('ticket');

        res.send(orders);
    }
);

export { router as getOrdersRouter };
