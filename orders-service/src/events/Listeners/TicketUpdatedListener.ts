import { Message } from 'node-nats-streaming';
import { Subjects, DomainEventListener, TicketUpdatedEvent, NotFoundError } from '@gearthlogic/common'
import { Ticket } from '../../Models/Ticket';
import { queueGroupName } from './queueGroupName';

export class TicketUpdatedListener extends DomainEventListener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { price, title } = data;
        const ticket = await Ticket.findByVersion(data);

        if (!ticket) throw new Error("Ticket not found");

        ticket.set({ price, title });
        await ticket.save();

        msg.ack();
    }
}