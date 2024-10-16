import * as db from './db';
import { AppDataSource } from '../database/data-source';
import { confirm, input, password, select, checkbox } from '@inquirer/prompts';
import { createId } from '@paralleldrive/cuid2';
import { encrypt, generateHash, generateSalt, generateSecret } from '../lib/encryption';
import { Application } from '../database/entities/applications';
import { Organisation } from '../database/entities/organisations';
import { Credential } from '../database/entities/credentials';
import { ApplicationAuthenticationPreferences } from '../database/entities/application_authentication_preferences';
import { CredentialPermission } from '../database/entities/credential_permissions';
import { AuthenticationProviders } from '../database/entities/authentication_providers';
import { ApplicationAuthenticationProviders } from '../database/entities/application_authentication_providers';
import {
  CREDENTIAL_PERMISSIONS,
  DEFAULT_OAUTH_PROVIDERS,
  DEFAULT_ORG_NAME,
  DEFAULT_WEBHOOK_EVENTS
} from './defaults';
import { AuthenticationUser } from '../database/entities/authentication_users';
import { getApplicationCredentials } from './lib';
import { WebhookEvents } from '../database/entities/webhook_events';
import { ApplicationWebhooks } from '../database/entities/application_webhooks';
import { ApplicationWebhookEvents } from '../database/entities/application_webhook_events';

const PROXY_PORT = process.env.PROXY_PORT;

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

    console.log('Database seed data and schema synced successfully');
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

export async function createApplication() {
  try {
    await db.initialize();

    const pid = createId().slice(0, 12);
    const keyId = createId().slice(0, 12);
    const secretKey = generateSecret();

    const organisationRepository = AppDataSource.getRepository(Organisation);
    const applicationRepository = AppDataSource.getRepository(Application);
    const credentialsRepository = AppDataSource.getRepository(Credential);
    const credentialPermissionsRepository = AppDataSource.getRepository(CredentialPermission);
    const appAuthPreferencesRepository = AppDataSource.getRepository(
      ApplicationAuthenticationPreferences
    );

    const organisation = await organisationRepository.findOneBy({
      name: DEFAULT_ORG_NAME
    });

    if (!organisation) {
      console.log('Organisation not found, exiting...');
      return;
    }

    const name = await input({
      message: 'Choose and application name:'
    });

    const application = applicationRepository.create({
      name,
      pid,
      orgId: organisation.id,
      createdAt: new Date().toISOString(),
      historyTtlHours: 24
    });

    await applicationRepository.save(application);

    const credentials = credentialsRepository.create({
      orgId: organisation.id,
      appId: application.id,
      appPid: application.pid,
      keyId,
      secretKey,
      createdAt: new Date().toISOString()
    });

    await credentialsRepository.save(credentials);

    const appAuthPreferences = appAuthPreferencesRepository.create({
      appId: application.id,
      tokenExpiry: 3600,
      sessionExpiry: 3600,
      authStorageType: 'persist',
      createdAt: new Date().toISOString()
    });

    await appAuthPreferencesRepository.save(appAuthPreferences);

    for (const permission of CREDENTIAL_PERMISSIONS) {
      const credentialPermission = credentialPermissionsRepository.create({
        credentialId: credentials.id,
        keyId,
        permission: permission,
        createdAt: new Date().toISOString()
      });

      await credentialPermissionsRepository.save(credentialPermission);
    }

    console.log(getApplicationCredentials(credentials, application));
  } catch (err) {
    console.error('Error creating application:', err);
  } finally {
    await db.end();
  }
}

export async function registerOauthProvider() {
  try {
    await db.initialize();

    const applicationRepository = AppDataSource.getRepository(Application);
    const authenticationProvidersRepository = AppDataSource.getRepository(AuthenticationProviders);
    const appAuthProvidersRepository = AppDataSource.getRepository(
      ApplicationAuthenticationProviders
    );

    const applications = await applicationRepository.find();
    const providers = await authenticationProvidersRepository.find();

    const appId = await select({
      message: 'Choose an application',
      choices: applications.map((app) => ({
        name: app.name,
        value: app.id
      }))
    });

    const provider = await select({
      message: 'Choose an OAuth provider',
      choices: providers.map((provider) => ({
        name: provider.friendlyName,
        value: provider
      }))
    });

    const clientId = await input({
      message: 'Enter OAuth clientID:'
    });

    const clientSecret = await password({
      message: 'Enter OAuth clientSecret:',
      mask: true
    });

    const encryptionSalt = generateSalt();
    const encryptedClientSecret = encrypt(clientSecret, encryptionSalt);

    const appAuthProvider = appAuthProvidersRepository.create({
      appId,
      providerId: provider.id,
      clientId,
      clientSecret: encryptedClientSecret,
      salt: encryptionSalt,
      createdAt: new Date().toISOString(),
      enabled: true
    });

    await appAuthProvidersRepository.save(appAuthProvider);

    console.log('OAuth provider registered successfully', {
      authorizedOrigin: `http://localhost:${PROXY_PORT}`,
      authorizedCallbackUri: `http://localhost:${PROXY_PORT}/auth/dev/users/idp/${provider.name}/callback`
    });
  } catch (err) {
    console.error('Error registering OAuth provider:', err);
  } finally {
    await db.end();
  }
}

export async function deregisterOauthProvider() {
  try {
    await db.initialize();

    const appAuthProvidersRepository = AppDataSource.getRepository(
      ApplicationAuthenticationProviders
    );

    const providers = await appAuthProvidersRepository
      .createQueryBuilder('aap')
      .innerJoin(AuthenticationProviders, 'ap', 'aap.providerId = ap.id')
      .select(['aap.id', 'ap.friendlyName'])
      .getRawMany();

    if (!providers.length) {
      console.log('No OAuth providers enabled');
      return;
    }

    const providerId = await select({
      message: 'Choose an OAuth provider',
      choices: providers.map((provider) => ({
        name: provider.ap_friendlyName,
        value: provider.aap_id
      }))
    });

    const appAuthProvider = await appAuthProvidersRepository.findOne({
      where: {
        id: providerId
      }
    });

    if (!appAuthProvider) {
      console.log('OAuth provider not found, exiting...');
      return;
    }

    const confirmation = await confirm({
      message: `Are you sure you want to delete the OAuth provider ${appAuthProvider.id}?`
    });

    if (!confirmation) {
      console.log('OAuth provider not deleted, exiting...');
      return;
    }

    await appAuthProvidersRepository.delete({
      id: providerId
    });

    console.log('OAuth provider deleted successfully');
  } catch (err) {
    console.error('Error registering OAuth provider:', err);
  } finally {
    await db.end();
  }
}

export async function readApplicationData() {
  try {
    await db.initialize();

    const applicationRepository = AppDataSource.getRepository(Application);
    const credentialsRepository = AppDataSource.getRepository(Credential);

    const applications = await applicationRepository.find();

    const appId = await select({
      message: 'Choose an application',
      choices: applications.map((app) => ({
        name: app.name,
        value: app.id
      }))
    });

    const appCredentials = await credentialsRepository.find({
      where: {
        appId
      }
    });

    const credentials = appCredentials.map((credential) => getApplicationCredentials(credential));

    console.log(credentials);
  } catch (err) {
    console.error('Error reading application data:', err);
  } finally {
    await db.end();
  }
}

export async function verifyAuthUser() {
  try {
    await db.initialize();

    const authenticationUserRepository = AppDataSource.getRepository(AuthenticationUser);

    const email = await input({ message: 'Enter email:' });
    const hashedEmail = generateHash(email);
    const now = new Date().toISOString();

    const authenticationUser = await authenticationUserRepository.findOne({
      where: {
        emailHash: hashedEmail
      }
    });

    if (!authenticationUser) {
      console.log('Authentication user not found');
      return;
    }

    const verifications = await AppDataSource.query(
      `SELECT * FROM authentication_user_verification 
       WHERE uid = $1 
       AND "verifiedAt" IS NULL 
       AND type = $2 
       AND "expiresAt" > $3 
       LIMIT 1`,
      [authenticationUser.id, 'register', now]
    );

    if (verifications.length) {
      console.log('Verification code:', verifications[0].code);
    } else {
      console.log('Verification code not found');
    }
  } catch (err) {
    console.log('Error verifying authentication user:', err);
  } finally {
    await db.end();
  }
}

export async function getResetPasswordverificationCode() {
  try {
    await db.initialize();

    const authenticationUserRepository = AppDataSource.getRepository(AuthenticationUser);

    const email = await input({
      message: 'Enter email:'
    });

    const hashedEmail = generateHash(email);
    const now = new Date().toISOString();

    const authenticationUser = await authenticationUserRepository.findOne({
      where: {
        emailHash: hashedEmail
      }
    });

    if (!authenticationUser) {
      console.log('Authentication user not found');
      return;
    }

    const verifications = await AppDataSource.query(
      `SELECT * FROM authentication_user_verification 
       WHERE uid = $1 
       AND "verifiedAt" IS NULL 
       AND type = $2 
       AND "expiresAt" > $3 
       LIMIT 1`,
      [authenticationUser.id, 'passwordReset', now]
    );

    if (verifications.length) {
      console.log('Password reset code:', verifications[0].code);
    } else {
      console.log('Password reset code not found');
    }
  } catch (err) {
    console.log('Error getting password reset code:', err);
  }
}

export async function createWebhook() {
  try {
    await db.initialize();

    const applicationRepository = AppDataSource.getRepository(Application);
    const webhookEventsRepository = AppDataSource.getRepository(WebhookEvents);
    const applicationWebhooksRepository = AppDataSource.getRepository(ApplicationWebhooks);
    const applicationWebhookEventsRepository =
      AppDataSource.getRepository(ApplicationWebhookEvents);

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
