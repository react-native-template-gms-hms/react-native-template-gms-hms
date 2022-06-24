import { appSchema } from '@nozbe/watermelondb';
import { tableSchema } from '@nozbe/watermelondb/Schema';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'notifications',
      columns: [
        { name: 'state', type: 'string' },
        { name: 'data', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
