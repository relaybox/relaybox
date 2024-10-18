import { input, select } from '@inquirer/prompts';
import * as db from '@/cli/db';
import { AppDataSource } from '@/database/data-source';
import { createId } from '@paralleldrive/cuid2';
import { generateSecret } from '@/lib/encryption';
import { Application } from '@/database/entities/applications';
import { Organisation } from '@/database/entities/organisations';
import { Credential } from '@/database/entities/credentials';
import { ApplicationAuthenticationPreference } from '@/database/entities/application_authentication_preferences';
import { CredentialPermission } from '@/database/entities/credential_permissions';
import { CREDENTIAL_PERMISSIONS, DEFAULT_ORG_NAME } from '@/cli/defaults';
import { ApplicationCredentials } from '@/types/application.types';

export function getApplicationCredentials(
  credential: Credential,
  application?: Application
): ApplicationCredentials {
  const appPid = application?.pid || credential.appPid;

  return {
    id: appPid,
    publicKey: `${appPid}.${credential.keyId}`,
    apiKey: `${appPid}.${credential.keyId}:${credential.secretKey}`
  };
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
      ApplicationAuthenticationPreference
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

export async function selectApplication(): Promise<Application | undefined> {
  try {
    const applicationRepository = AppDataSource.getRepository(Application);

    const applications = await applicationRepository.find();

    if (!applications.length) {
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
      return;
    }

    return application;
  } catch (err) {
    console.error('Error selecting application:', err);
  }
}
