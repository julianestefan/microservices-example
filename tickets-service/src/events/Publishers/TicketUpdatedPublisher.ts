import { TicketUpdatedEvent, DomainEventPublisher, Subjects } from '@gearthlogic/common';

export class TicketUpdatedPublisher extends DomainEventPublisher<TicketUpdatedEvent> {
    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}