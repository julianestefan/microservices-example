import { Message } from 'node-nats-streaming';
import { Subjects, DomainEventListener, TicketCreatedEvent } from '@gearthlogic/common'
import { Ticket } from '../../Models/Ticket';
import { queueGroupName } from './queueGroupName';

export class TicketCreatedListener extends DomainEventListener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: any, msg: Message) {

        const ticket = Ticket.build({
            price: data.price,
            id: data.id,
            title: data.title
        });
        
        await ticket.save();

        msg.ack();
    }
}