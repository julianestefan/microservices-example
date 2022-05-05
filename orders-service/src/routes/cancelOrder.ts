import express, { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import { param } from 'express-validator';
import { checkAuth, validationHandler, NotFoundError, OrderStatus } from '@gearthlogic/common';

import { Order } from '../Models/Order';
import { OrderCancelledPublisher } from '../events/Publishers/OrdercancelledPublisher';
import { eventBusClient } from '../events/EventBusClient';

const router = express.Router();

router.put(
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

        order.status = OrderStatus.Cancelled;
        await order.save();

        new OrderCancelledPublisher(eventBusClient).publish({
            id: order.id,
            ticket: {
                id: order.ticket.id
            },
            version: order.version
        });

        res.send(order);
    }
);

export { router as cancelOrderRouter };
