import { Message } from 'node-nats-streaming';
import { Subjects, DomainEventListener, OrderCancelledEvent } from '@gearthlogic/common'
import { Ticket } from '../../Models/Ticket';
import { queueGroupName } from './queueGroupName';

export class OrderCancelledListener extends DomainEventListener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {

        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) throw new Error("Ticket not found");

        ticket.orderId = undefined;
        await ticket.save();

        msg.ack();
    }
}