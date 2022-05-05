import express, { Request, Response, Router } from 'express';
import {NotFoundError} from '@gearthlogic/common'

import {Ticket} from '../Models/Ticket';

const router = express.Router();

router.get(
    '/api/tickets/:id',
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);

        if(!ticket) {
            throw new NotFoundError
        }

        res.send(ticket);
    }
);

export { router as getTicketRouter };
