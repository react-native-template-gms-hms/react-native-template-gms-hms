import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';
// import migrations from './migrations';

const adapter = new SQLiteAdapter({
  schema,
  // migrations,
  dbName: 'sqlite',
  jsi: true,
  onSetUpError: (error) => {
    console.log(error);
    return error;
  },
});

const database = new Database({
  adapter,
  modelClasses: [],
});

const resetDatabase = async () => {
  await database.write(async () => {
    await database.unsafeResetDatabase();
  });
};

const localStorage = {
  setItem: (key: string, value: string): Promise<void> => {
    return database.adapter.setLocal(key, value);
  },
  getItem: async (key: string, defaultValue?: string): Promise<string | null> => {
    const item = await database.adapter.getLocal(key);
    if (item !== null) {
      return item;
    } else if (defaultValue !== undefined) {
      return defaultValue;
    }
    return null;
  },
  removeItem: (key: string): Promise<void> => {
    return database.adapter.removeLocal(key);
  },
};

export { database, resetDatabase, localStorage };
