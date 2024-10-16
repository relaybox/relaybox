export const DEFAULT_ORG_NAME = 'ORG001';

export const CREDENTIAL_PERMISSIONS = ['metrics', 'subscribe', 'publish', 'history', 'presence'];

export const DEFAULT_OAUTH_PROVIDERS = [
  {
    name: 'google',
    friendlyName: 'Google',
    defaultScopes: ['openid', 'email', 'profile']
  },
  {
    name: 'github',
    friendlyName: 'GitHub',
    defaultScopes: ['user:email']
  }
];

export const DEFAULT_WEBHOOK_EVENTS = [
  {
    type: 'auth:session:initialize',
    enabled: true,
    name: 'Auth: Session initialize',
    createdAt: ''
  },
  {
    type: 'auth:signin',
    enabled: true,
    name: 'Auth: User sign-in',
    createdAt: ''
  },
  {
    type: 'auth:signup',
    enabled: true,
    name: 'Auth: User sign-up',
    createdAt: ''
  },
  {
    type: 'auth:verify',
    enabled: true,
    name: 'Auth: User verify',
    createdAt: ''
  },
  {
    type: 'presence:join',
    enabled: true,
    name: 'Presence: User join presence set',
    createdAt: ''
  },
  {
    type: 'presence:leave',
    enabled: true,
    name: 'Presence: User leave presence set',
    createdAt: ''
  },
  {
    type: 'presence:update',
    enabled: true,
    name: 'Presence: User update presence data',
    createdAt: ''
  },
  {
    type: 'room:create',
    enabled: true,
    name: 'Room: Created',
    createdAt: ''
  },
  {
    type: 'room:destroy',
    enabled: true,
    name: 'Room: Destroyed',
    createdAt: ''
  },
  {
    type: 'room:join',
    enabled: true,
    name: 'Room: User join',
    createdAt: ''
  },
  {
    type: 'room:leave',
    enabled: true,
    name: 'Room: User leave',
    createdAt: ''
  },
  {
    type: 'room:publish',
    enabled: true,
    name: 'Room: User publish message',
    createdAt: ''
  },
  {
    type: 'user:status:update',
    enabled: true,
    name: 'User: Status update',
    createdAt: ''
  }
];
