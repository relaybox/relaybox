import * as db from '@/cli/db';
import { AppDataSource } from '@/database/data-source';
import { DEFAULT_OAUTH_PROVIDERS, DEFAULT_ORG_NAME, DEFAULT_WEBHOOK_EVENTS } from '@/cli/defaults';

export async function setupDatabase() {
  await db.initialize({ synchronize: true });

  const queryRunner = AppDataSource.createQueryRunner();

  await queryRunner.startTransaction();

  try {
    await AppDataSource.createQueryBuilder()
      .insert()
      .into('organisations')
      .values({
        name: DEFAULT_ORG_NAME,
        createdAt: new Date().toISOString()
      })
      .orIgnore()
      .execute();

    await AppDataSource.createQueryBuilder()
      .insert()
      .into('authentication_providers')
      .values(DEFAULT_OAUTH_PROVIDERS)
      .orIgnore()
      .execute();

    const webhookEvents = DEFAULT_WEBHOOK_EVENTS.map((event) => ({
      ...event,
      createdAt: new Date().toISOString()
    }));

    await AppDataSource.createQueryBuilder()
      .insert()
      .into('webhook_events')
      .values(webhookEvents)
      .orIgnore()
      .execute();

    await queryRunner.commitTransaction();

    console.log('Database content and schema synced successfully');
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error('Error seeding data:', err);
  } finally {
    await queryRunner.release();
    await db.end();
  }
}

export async function syncDatabase() {
  try {
    await db.initialize({ synchronize: true });
  } catch (err) {
    console.error('Error syncing database:', err);
  } finally {
    await db.end();
  }
}
