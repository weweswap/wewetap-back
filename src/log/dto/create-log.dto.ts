import { EventType } from '../types/eventType';

export class CreateLogDto {
  readonly user_id: string;
  readonly task_id: string;
  readonly is_violation: boolean;
  readonly event_type: EventType;
  readonly coins: number;
}
