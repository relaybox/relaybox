import * as db from '../db';
import { AppDataSource } from '../../database/data-source';
import { input, select, checkbox } from '@inquirer/prompts';
import { generateSecret } from '../../lib/encryption';
import { Application } from '../../database/entities/applications';
import { WebhookEvents } from '../../database/entities/webhook_events';
import { ApplicationWebhooks } from '../../database/entities/application_webhooks';

export async function createWebhook() {
  try {
    await db.initialize();

    const applicationRepository = AppDataSource.getRepository(Application);
    const webhookEventsRepository = AppDataSource.getRepository(WebhookEvents);
    const applicationWebhooksRepository = AppDataSource.getRepository(ApplicationWebhooks);

    const applications = await applicationRepository.find();

    if (!applications.length) {
      console.log('No applications found');
      return;
    }

    const appId = await select({
      message: 'Choose an application',
      choices: applications.map((app) => ({
        name: app.name,
        value: app.id
      }))
    });

    const application = await applicationRepository.findOne({
      where: {
        id: appId
      }
    });

    if (!application) {
      console.log('Application not found, exiting...');
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

    const applicationWebhook = applicationWebhooksRepository.create({
      appId: application.id,
      appPid: application.pid,
      name: webhookName,
      url: webhookUrl,
      signingKey: generateSecret(),
      createdAt: new Date().toISOString(),
      enabled: true
    });

    await applicationWebhooksRepository.save(applicationWebhook);

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
  }
}
