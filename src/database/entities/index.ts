import { Organisation } from './organisations';
import { Application } from './applications';
import { Credential } from './credentials';
import { Event } from './events';
import { CredentialPermission } from './credential_permissions';
import { CredentialPattern } from './credential_patterns';
import { Room } from './rooms';
import { RoomSession } from './room_sessions';
import { Connection } from './connections';
import { AdminUser } from './admin_users';
import { Session } from './sessions';
import { DeliveryMetric } from './delivery_metrics';
import { OrganisationAdminUser } from './organisation_admin_users';
import { ApplicationAdminUser } from './application_admin_users';
import { AuthenticationUser } from './authentication_users';
import { AuthenticationUserVerification } from './authentication_user_verification';
import { AuthenticationUserIdentity } from './authentication_user_identities';
import { AuthenticationUserMfaFactor } from './authentication_user_mfa_factors';
import { AuthenticationUserMfaChallenge } from './authentication_user_mfa_challenges';
import { AuthenticationUsersApplication } from './authentication_users_applications';
import { AuthenticationProvider } from './authentication_providers';
import { ApplicationAuthenticationProvider } from './application_authentication_providers';
import { ApplicationAuthenticationPreference } from './application_authentication_preferences';
import { AuthenticationActivityLog } from './authentication_activity_logs';
import { ApplicationWebhook } from './application_webhooks';
import { WebhookEvents } from './webhook_events';
import { ApplicationWebhookLog } from './application_webhook_logs';
import { ApplicationWebhookEvent } from './application_webhook_events';
import { MessageHistory } from './message_history';
import { Asset } from './assets';
import { AssetUser } from './asset_users';
import { RoomMember } from './room_members';

export default [
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
  RoomMember,
  Connection,
  AdminUser,
  OrganisationAdminUser,
  ApplicationAdminUser,
  AuthenticationUser,
  AuthenticationUserVerification,
  AuthenticationUserIdentity,
  AuthenticationUserMfaFactor,
  AuthenticationUserMfaChallenge,
  AuthenticationUsersApplication,
  AuthenticationProvider,
  ApplicationAuthenticationProvider,
  ApplicationAuthenticationPreference,
  AuthenticationActivityLog,
  ApplicationWebhook,
  ApplicationWebhookLog,
  ApplicationWebhookEvent,
  WebhookEvents,
  MessageHistory,
  Asset,
  AssetUser
];
