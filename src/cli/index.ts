#!/usr/bin/env node

import 'reflect-metadata';
import { Command } from 'commander';
import {
  createApplication,
  deregisterOauthProvider,
  readApplicationData,
  registerOauthProvider,
  setupDatabase,
  syncDatabase,
  verifyAuthUser
} from './actions';
import { execSync } from 'child_process';

const program = new Command();

program
  .command('platform <action>')
  .description('Manage the platform')
  .action(async (action) => {
    switch (action) {
      case 'up':
        console.log('Starting platform...');
        execSync('./shell/platform-up.sh', { stdio: 'inherit' });
        await setupDatabase();
        console.log('Platform started successfully.');
        break;

      case 'sync':
        console.log('Syncing platform...');
        execSync('./shell/platform-up.sh', { stdio: 'inherit' });
        await syncDatabase();
        console.log('Platform synced successfully.');
        break;

      case 'down':
        console.log('Stopping platform...');
        execSync('docker-compose down', { stdio: 'inherit' });
        console.log('Platform stopped successfully.');
        break;

      default:
        console.error(`Unknown action: ${action}`);
    }
  });

program
  .command('application <action>')
  .description('Create an application')
  .action((action) => {
    switch (action) {
      case 'create':
        createApplication();
        break;

      case 'read':
        readApplicationData();
        break;

      default:
        console.error(`Unknown action: ${action}`);
    }
  });

program
  .command('oauth <action>')
  .description('Register an OAuth provider')
  .action(async (action) => {
    switch (action) {
      case 'create':
        await registerOauthProvider();
        break;

      case 'delete':
        await deregisterOauthProvider();
        break;

      default:
        console.error(`Unknown action: ${action}`);
    }
  });

program
  .command('auth <action>')
  .description('Manage authentication actions')
  .action(async (action) => {
    switch (action) {
      case 'verify':
        await verifyAuthUser();
        break;

      default:
        console.error(`Unknown action: ${action}`);
    }
  });

program.parse(process.argv);
