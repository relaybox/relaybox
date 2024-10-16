import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { DataSource } from 'typeorm';
import { Organisation } from './entities/organisations';
import { Application } from './entities/applications';
import { Credential } from './entities/credentials';
import { Event } from './entities/events';
import { CredentialPermission } from './entities/credential_permissions';
import { CredentialPattern } from './entities/credential_patterns';
import { Room } from './entities/rooms';
import { RoomSession } from './entities/room_sessions';
import { Connection } from './entities/connections';
import { AdminUser } from './entities/admin_users';
import { Session } from './entities/sessions';
import { DeliveryMetric } from './entities/delivery_metrics';
import { OrganisationAdminUser } from './entities/organisation_admin_users';
import { ApplicationAdminUser } from './entities/application_admin_users';
import { AuthenticationUser } from './entities/authentication_users';
import { AuthenticationUserVerification } from './entities/authentication_user_verification';
import { AuthenticationUserIdentity } from './entities/authentication_user_identities';
import { AuthenticationUserMfaFactors } from './entities/authentication_user_mfa_factors';
import { AuthenticationUserMfaChallenges } from './entities/authentication_user_mfa_challenges';
import { AuthenticationUsersApplications } from './entities/authentication_users_applications';
import { AuthenticationProviders } from './entities/authentication_providers';
import { ApplicationAuthenticationProviders } from './entities/application_authentication_providers';
import { ApplicationAuthenticationPreferences } from './entities/application_authentication_preferences';
import { AuthenticationActivityLog } from './entities/authentication_activity_logs';
import { ApplicationWebhooks } from './entities/application_webhooks';
import { WebhookEvents } from './entities/webhook_events';
import { ApplicationWebhookLogs } from './entities/application_webhook_logs';
import { ApplicationWebhookEvents } from './entities/application_webhook_events';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 9001),
  username: process.env.DB_USER || 'relaybox_user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'relaybox_core_platform',
  synchronize: true,
  logging: false,
  entities: [
    Organisation,
    Application,
    Credential,
    Event,
    CredentialPermission,
    CredentialPattern,
    Session,
    DeliveryMetric,
    Room,
    RoomSession,
    Connection,
    AdminUser,
    OrganisationAdminUser,
    ApplicationAdminUser,
    AuthenticationUser,
    AuthenticationUserVerification,
    AuthenticationUserIdentity,
    AuthenticationUserMfaFactors,
    AuthenticationUserMfaChallenges,
    AuthenticationUsersApplications,
    AuthenticationProviders,
    ApplicationAuthenticationProviders,
    ApplicationAuthenticationPreferences,
    AuthenticationActivityLog,
    ApplicationWebhooks,
    ApplicationWebhookLogs,
    ApplicationWebhookEvents,
    WebhookEvents
  ]
});
