import express, { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { checkAuth, validationHandler } from '@gearthlogic/common';

import { Ticket } from '../Models/Ticket';
import { TicketCreatedPublisher } from '../events/Publishers/TicketCreatedPublisher';
import { eventBusClient } from '../events/EventBusClient';

const router = express.Router();

router.post(
    '/api/tickets',
    checkAuth,
    [
        body('title')
            .not().isEmpty()
            .withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be grater than 0'),
    ],
    validationHandler,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;

        const ticket = Ticket.build({
            title, price, userId: req.user!.id
        });

        await ticket.save();

        new TicketCreatedPublisher(eventBusClient).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        });

        res.status(201).send(ticket);
    }
);

export { router as createTicketRouter };
