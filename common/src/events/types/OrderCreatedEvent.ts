import { Subjects } from './Subjects';
import { OrderStatus } from '../../status/order';

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data: {
        id: string;
        status: OrderStatus;
        userId: string;
        expiresAt: string;
        ticket: {
            id: string;
            price: number;
        };
        version: number;
    }
}