import { DomainEvent } from './types/DomainEvent';
import { IEventBusclient } from './IEventBusClient'

export abstract class DomainEventPublisher<T extends DomainEvent> {
    abstract subject: T['subject'];

    constructor(protected readonly client: IEventBusclient) { }

    publish(data: T['data']): Promise<void> {
        return this.client.publish(this.subject, JSON.stringify(data))
    }
}

