import express, { Request, Response, Router } from 'express';

import { Ticket } from '../Models/Ticket';

const router = express.Router();

router.get(
    '/api/tickets',
    async (req: Request, res: Response) => {
        const ticket = await Ticket.find();

        res.send(ticket);
    }
);

export { router as getTicketsRouter };
