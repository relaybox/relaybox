import * as db from '@/cli/db';
import { AppDataSource } from '@/database/data-source';
import { input, select, checkbox } from '@inquirer/prompts';
import { generateSecret } from '@/lib/encryption';
import { WebhookEvents } from '@/database/entities/webhook_events';
import { ApplicationWebhook } from '@/database/entities/application_webhooks';
import { ApplicationWebhookEvent } from '@/database/entities/application_webhook_events';
import { selectApplication } from './application';

export async function createWebhook() {
  try {
    await db.initialize();

    const webhookEventsRepository = AppDataSource.getRepository(WebhookEvents);
    const applicationWebhookRepository = AppDataSource.getRepository(ApplicationWebhook);

    const application = await selectApplication();

    if (!application) {
      console.log(`Application not found`);
      return;
    }

    const webhookName = await input({
      message: 'Enter a name for the webhook:'
    });

    const webhookUrl = await input({
      message: 'Enter a valid URL for the webhook:'
    });

    const webhookEvents = await webhookEventsRepository.find();

    const events = await checkbox({
      message: 'Choose events to attach:',
      choices: webhookEvents.map((event) => ({
        name: event.name,
        value: event.id
      }))
    });

    const applicationWebhook = applicationWebhookRepository.create({
      appId: application.id,
      appPid: application.pid,
      name: webhookName,
      url: webhookUrl,
      signingKey: generateSecret(),
      createdAt: new Date().toISOString(),
      enabled: true
    });

    await applicationWebhookRepository.save(applicationWebhook);

    const applicationWebhookEvents = events.map((eventId) => ({
      appId: application.id,
      appPid: application.pid,
      webhookId: applicationWebhook.id,
      webhookEventId: eventId,
      createdAt: new Date().toISOString()
    }));

    await AppDataSource.createQueryBuilder()
      .insert()
      .into('application_webhook_events')
      .values(applicationWebhookEvents)
      .orIgnore()
      .execute();

    const { signingKey, url } = applicationWebhook;

    console.log({
      signingKey,
      url
    });
  } catch (err: unknown) {
    console.log('Error creating webhook:', err);
  } finally {
    await db.end();
  }
}

export async function editWebhook() {
  await db.initialize();

  const queryRunner = AppDataSource.createQueryRunner();

  try {
    await queryRunner.startTransaction();

    const webhookEventsRepository = AppDataSource.getRepository(WebhookEvents);
    const applicationWebhookRepository = AppDataSource.getRepository(ApplicationWebhook);
    const applicationWebhookEventsRepository = AppDataSource.getRepository(ApplicationWebhookEvent);

    const application = await selectApplication();

    if (!application) {
      return;
    }

    const webhooks = await applicationWebhookRepository.find({
      where: {
        appId: application.id
      }
    });

    if (!webhooks.length) {
      console.log('No webhooks found');
      return;
    }

    const webhookId = await select({
      message: 'Choose a webhook',
      choices: webhooks.map((webhook) => ({
        name: `${webhook.name} - ${webhook.url}`,
        value: webhook.id
      }))
    });

    const webhook = await getWebhookById(webhookId);

    if (!webhook) {
      console.log(`Unable to find webhook`);
      return;
    }

    const url = await input({
      message: 'Edit webhook url? ',
      default: webhook.url
    });

    const enabled = await select({
      message: 'Change webhook status:',
      choices: ['enabled', 'disabled'],
      default: webhook.enabled ? 'enabled' : 'disabled'
    });

    const webhookEvents = await webhookEventsRepository.find();

    const events = await checkbox({
      message: 'Choose events to attach:',
      choices: webhookEvents.map((event) => ({
        name: event.name,
        value: event.id,
        checked:
          !!webhook.webhookEvents?.find((webhookEvent: any) => webhookEvent.id === event.id) ||
          false
      }))
    });

    const updatedWebhook = applicationWebhookRepository.create({
      ...webhook,
      url,
      enabled: enabled === 'enabled'
    });

    await applicationWebhookRepository.save(updatedWebhook);

    await applicationWebhookEventsRepository.delete({
      webhookId: webhook.id
    });

    const applicationWebhookEvents = events.map((eventId) => ({
      appId: application.id,
      appPid: application.pid,
      webhookId: webhook.id,
      webhookEventId: eventId,
      createdAt: new Date().toISOString()
    }));

    await AppDataSource.createQueryBuilder()
      .insert()
      .into('application_webhook_events')
      .values(applicationWebhookEvents)
      .orIgnore()
      .execute();

    await queryRunner.commitTransaction();

    const output = await getWebhookById(webhookId);

    console.log(output);
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error('Error editing webhook:', err);
  } finally {
    await queryRunner.release();
    await db.end();
  }
}

export async function listWebhooks() {
  try {
    await db.initialize();

    const applicationWebhookRepository = AppDataSource.getRepository(ApplicationWebhook);

    const application = await selectApplication();

    if (!application) {
      return;
    }

    const webhooks = await applicationWebhookRepository.find({
      where: {
        appId: application.id
      }
    });

    if (!webhooks.length) {
      console.log('No webhooks found');
      return;
    }

    const webhookId = await select({
      message: 'Choose a webhook',
      choices: webhooks.map((webhook) => ({
        name: `${webhook.name} - ${webhook.url}`,
        value: webhook.id
      }))
    });

    const webhook = await getWebhookById(webhookId);

    if (!webhook) {
      console.log(`Unable to find webhook`);
      return;
    }

    console.log(webhook);
  } catch (err) {
    console.error('Error listing webhooks:', err);
  } finally {
    await db.end();
  }
}

export async function getWebhookById(
  id: string
): Promise<(ApplicationWebhook & { webhookEvents: ApplicationWebhookEvent[] }) | undefined> {
  try {
    const getWebhookById = await AppDataSource.query(
      `
      SELECT aw.*, 
      COALESCE(
        json_agg(
          json_build_object(
            'id', we.id,
            'type', we.type,
            'enabled', aw."enabled",
            'name', we."name",
            'description', we."description",
            'category', we."category"
          ) 
        ) FILTER (WHERE we.id IS NOT NULL), '[]'::json
      ) as "webhookEvents"
      FROM application_webhooks aw
      LEFT JOIN application_webhook_events awe ON awe."webhookId" = aw.id
      LEFT JOIN webhook_events we ON we.id = awe."webhookEventId"
      WHERE aw.id = $1 AND aw."deletedAt" IS NULL
      GROUP BY aw.id;
    `,
      [id]
    );

    if (!getWebhookById.length) {
      console.log('Webhook not found');
      return;
    }

    return getWebhookById[0];
  } catch (err) {
    console.log('Error getting webhook by id:', err);
    return;
  }
}
