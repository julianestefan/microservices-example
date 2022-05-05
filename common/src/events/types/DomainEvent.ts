import { Subjects } from './Subjects';

export interface DomainEvent {
    subject: Subjects;
    data: any;
}