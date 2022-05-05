import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import mongoose from 'mongoose';
import { checkAuth, NotFoundError, validationHandler } from '@gearthlogic/common';

import { Order } from '../Models/Order';

const router = express.Router();

router.get(
    '/api/orders/:orderId',
    checkAuth,
    [
        param('orderId')
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    ],
    validationHandler,
    async (req: Request, res: Response) => {
        const order = await Order.findOne({
            _id: req.params.orderId,
            userId: req.user!.id
        }).populate('ticket');

        if (!order) throw new NotFoundError;

        res.send(order);
    }
);

export { router as getOrderRouter };
