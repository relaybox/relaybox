import * as db from '@/cli/db';
import { AppDataSource } from '@/database/data-source';
import { confirm, input, password, select } from '@inquirer/prompts';
import { encrypt, generateSalt } from '@/lib/encryption';
import { Application } from '@/database/entities/applications';
import { AuthenticationProvider } from '@/database/entities/authentication_providers';
import { ApplicationAuthenticationProvider } from '@/database/entities/application_authentication_providers';

const PROXY_PORT = process.env.PROXY_PORT;

export async function registerOauthProvider() {
  try {
    await db.initialize();

    const applicationRepository = AppDataSource.getRepository(Application);
    const authenticationProviderRepository = AppDataSource.getRepository(AuthenticationProvider);
    const appAuthProviderRepository = AppDataSource.getRepository(
      ApplicationAuthenticationProvider
    );

    const applications = await applicationRepository.find();
    const providers = await authenticationProviderRepository.find();

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

    const appAuthProvider = appAuthProviderRepository.create({
      appId,
      providerId: provider.id,
      clientId,
      clientSecret: encryptedClientSecret,
      salt: encryptionSalt,
      createdAt: new Date().toISOString(),
      enabled: true
    });

    await appAuthProviderRepository.save(appAuthProvider);

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

    const appAuthProviderRepository = AppDataSource.getRepository(
      ApplicationAuthenticationProvider
    );

    const providers = await appAuthProviderRepository
      .createQueryBuilder('aap')
      .innerJoin(AuthenticationProvider, 'ap', 'aap.providerId = ap.id')
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

    const appAuthProvider = await appAuthProviderRepository.findOne({
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

    await appAuthProviderRepository.delete({
      id: providerId
    });

    console.log('OAuth provider deleted successfully');
  } catch (err) {
    console.error('Error registering OAuth provider:', err);
  } finally {
    await db.end();
  }
}
