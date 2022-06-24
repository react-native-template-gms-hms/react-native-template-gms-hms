import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, json } from '@nozbe/watermelondb/decorators';
import { database } from './database';

export class Notification extends Model {
  static table = 'notifications';
  @field('state') state!: string;
  @json('data', (json: string) => json) data!: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt?: Date;

  static async add(state: 'foreground' | 'background' | 'opened', data: string) {
    const added = await database.write(async () => {
      const awaited = await database.collections.get<Notification>('notifications').create((item) => {
        item.state = state;
        item.data = data;
      });
      return awaited;
    });
    return added;
  }
}
