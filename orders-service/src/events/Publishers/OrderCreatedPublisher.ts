import { OrderCreatedEvent, DomainEventPublisher, Subjects } from '@gearthlogic/common';

export class OrderCreatedPublisher extends DomainEventPublisher<OrderCreatedEvent> {
    readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}