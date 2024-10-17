#!/usr/bin/env node

import 'reflect-metadata';
import { Command } from 'commander';
import { execSync } from 'child_process';
import path from 'path';
import { configurePlatformConfig, createGlobalConfig, createProcessEnv } from '@/cli/config';
import { setupDatabase, syncDatabase } from '@/cli/actions/platform';
import { createApplication, readApplicationData } from '@/cli/actions/application';
import { deregisterOauthProvider, registerOauthProvider } from '@/cli/actions/oauth';
import { getResetPasswordverificationCode, verifyAuthUser } from '@/cli/actions/auth';
import { createWebhook, editWebhook } from '@/cli/actions/webhook';

const program = new Command();

program
  .command('platform <action>')
  .description('Manage the platform')
  .action(async (action) => {
    process.chdir(path.join(__dirname, '..'));

    switch (action) {
      case 'up':
        console.log('Starting platform...');
        createGlobalConfig();
        const { proxyPort } = createProcessEnv();
        execSync('./shell/platform-up.sh', { stdio: 'inherit' });
        await syncDatabase();
        await setupDatabase();
        console.log(`Platform running at http://localhost:${proxyPort}`);
        break;

      case 'sync':
        console.log('Syncing platform...');
        execSync('./shell/platform-up.sh', { stdio: 'inherit' });
        await syncDatabase();
        await setupDatabase();
        console.log('Platform synced successfully.');
        break;

      case 'down':
        console.log('Stopping platform...');
        execSync('docker-compose down', { stdio: 'inherit' });
        console.log('Platform stopped successfully.');
        break;

      case 'configure':
        const configOpts = await configurePlatformConfig();
        createGlobalConfig(configOpts);
        break;

      default:
        console.error(`Unknown action: ${action}`);
    }
  });

program
  .command('application <action>')
  .description('Create an application')
  .action((action) => {
    process.chdir(path.join(__dirname, '..'));

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
    process.chdir(path.join(__dirname, '..'));

    switch (action) {
      case 'enable':
        await registerOauthProvider();
        break;

      case 'disable':
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
    process.chdir(path.join(__dirname, '..'));

    switch (action) {
      case 'verify':
        await verifyAuthUser();
        break;

      case 'reset-password':
        await getResetPasswordverificationCode();
        break;

      default:
        console.error(`Unknown action: ${action}`);
    }
  });

program
  .command('webhook <action>')
  .description('Manage webhook actions')
  .action(async (action) => {
    process.chdir(path.join(__dirname, '..'));

    switch (action) {
      case 'create':
        await createWebhook();
        break;

      case 'edit':
        await editWebhook();
        break;

      default:
        console.error(`Unknown action: ${action}`);
    }
  });

program.parse(process.argv);
