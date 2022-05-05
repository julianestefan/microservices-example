import { TicketCreatedEvent, DomainEventPublisher, Subjects } from '@gearthlogic/common';

export class TicketCreatedPublisher extends DomainEventPublisher<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}