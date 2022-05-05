import express, { Request, Response, Router } from 'express';
import { body, param } from 'express-validator';
import { checkAuth, validationHandler, NotFoundError, NotAuthorizedError } from '@gearthlogic/common';

import { Ticket } from '../Models/Ticket';
import { TicketUpdatedPublisher } from '../events/Publishers/TicketUpdatedPublisher';
import { eventBusClient } from '../events/EventBusClient';

const router = express.Router();

router.put(
    '/api/tickets/:id',
    checkAuth,
    [
        param('id').notEmpty(),
        body('title')
            .not().isEmpty()
            .withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be grater than 0'),
    ],
    validationHandler,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);

        if(!ticket) {
            throw new NotFoundError;
        }
        
        if(req.user!.id !== ticket.userId ){
            throw new NotAuthorizedError;
        }

        await ticket.set(req.body).save();
        
        new TicketUpdatedPublisher(eventBusClient).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version,
        });

        res.send(ticket)
    }
);

export { router as updateTicketRouter };
