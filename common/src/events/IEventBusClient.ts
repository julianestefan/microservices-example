import { Subjects } from './types/Subjects';

export interface IEventBusclient {
    connect(): Promise<void>;
    listen(): void;
    publish(subject: Subjects, data: string): Promise<void>;
}