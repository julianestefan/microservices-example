import { OrderCancelledEvent, DomainEventPublisher, Subjects } from '@gearthlogic/common';

export class OrderCancelledPublisher extends DomainEventPublisher<OrderCancelledEvent> {
    readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}