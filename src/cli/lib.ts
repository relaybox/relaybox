import { Application } from '../database/entities/applications';
import { Credential } from '../database/entities/credentials';
import { ApplicationCredentials } from '../types/application.types';

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
