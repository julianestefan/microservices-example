import express, { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import moment from 'moment';
import { body } from 'express-validator';
import { BadRequestError, checkAuth, NotFoundError, validationHandler } from '@gearthlogic/common';

import { Ticket } from '../Models/Ticket';
import { Order } from '../Models/Order';
import { eventBusClient } from '../events/EventBusClient';
import { OrderCreatedPublisher } from '../events/Publishers/OrderCreatedPublisher';

const router = express.Router();

const ORDER_EXPIRATION_MINUTES = 15;

router.post(
    '/api/orders',
    checkAuth,
    [
        body('ticketId')
            .not().isEmpty()
            .withMessage('Ticked id is required')
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('Ticked id is not valid ')
    ],
    validationHandler,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.body.ticketId);

        if (!ticket) throw new NotFoundError;

        if (await ticket.isReserved())
            throw new BadRequestError("Ticket is already reserved");

        const expiresAt = moment().add(ORDER_EXPIRATION_MINUTES, 'minute').toDate();

        const order = Order.build({
            userId: req.user!.id,
            ticket,
            expiresAt
        });

        await order.save();

        new OrderCreatedPublisher(eventBusClient).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: order.ticket.id,
                price: order.ticket.price
            },
            version: order.version
        });

        res.status(201).send(order);
    }
);

export { router as createOrderRouter };
