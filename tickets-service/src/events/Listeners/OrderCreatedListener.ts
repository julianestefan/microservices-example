import { Message } from 'node-nats-streaming';
import { Subjects, DomainEventListener, OrderCreatedEvent } from '@gearthlogic/common'

import { Ticket } from '../../Models/Ticket';
import { queueGroupName } from './queueGroupName';
import { TicketUpdatedPublisher } from '../Publishers/TicketUpdatedPublisher';

export class OrderCreatedListener extends DomainEventListener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) throw new Error("The tickets does not exist")

        ticket.orderId = data.id;

        await ticket.save();

        msg.ack();
    }
}