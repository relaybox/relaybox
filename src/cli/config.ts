import os from 'os';
import path from 'path';
import fs from 'fs';
import { input, select } from '@inquirer/prompts';

const DEFAULT_PROXY_PORT = 9000;
const DEFAULT_DB_PORT = 9001;
const DEFAULT_LOG_LEVEL = 'info';

interface Config {
  proxy?: {
    port: number;
  };
  db?: {
    port: number;
  };
  log?: {
    level: string;
  };
}

interface ConfigOpts {
  proxyPort: number;
  dbPort: number;
  logLevel: string;
}

function getConfigFilePath() {
  const homeDir = os.homedir();
  const configFilePath = `${homeDir}/.relaybox/config.json`;

  return configFilePath;
}

export async function createGlobalConfig(configOpts?: ConfigOpts) {
  const configFilePath = getConfigFilePath();

  if (!fs.existsSync(configFilePath) || configOpts) {
    const config = {
      proxy: {
        port: configOpts?.proxyPort || DEFAULT_PROXY_PORT
      },
      db: {
        port: configOpts?.dbPort || DEFAULT_DB_PORT
      },
      log: {
        level: configOpts?.logLevel || DEFAULT_LOG_LEVEL
      }
    };

    const dir = path.dirname(configFilePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
  }
}

export function loadGlobalConfig() {
  const configFilePath = getConfigFilePath();

  if (fs.existsSync(configFilePath)) {
    return JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
  }

  return {};
}

export function createProcessEnv(): ConfigOpts {
  let config: Config = {};

  const configFilePath = getConfigFilePath();
  const envFilePath = path.join(__dirname, '..', '.env');

  if (fs.existsSync(configFilePath)) {
    config = loadGlobalConfig();
  }

  const proxyPort = config.proxy?.port || DEFAULT_PROXY_PORT;
  const dbPort = config.db?.port || DEFAULT_DB_PORT;
  const logLevel = config.log?.level || DEFAULT_LOG_LEVEL;

  const env = `PROXY_PORT=${proxyPort}
DB_PORT=${dbPort}
LOG_LEVEL=${logLevel}`;

  fs.writeFileSync(envFilePath, env);

  return {
    proxyPort,
    dbPort,
    logLevel
  };
}

export async function configurePlatformConfig(): Promise<ConfigOpts> {
  const proxyPort = await input({
    message: 'Choose application proxy port:',
    default: `${DEFAULT_PROXY_PORT}`
  });

  const dbPort = await input({
    message: 'Choose database port:',
    default: `${DEFAULT_DB_PORT}`
  });

  const logLevel = await select({
    message: 'Choose log level:',
    choices: ['debug', 'info', 'warn', 'error'],
    default: DEFAULT_LOG_LEVEL
  });

  return {
    proxyPort: Number(proxyPort),
    dbPort: Number(dbPort),
    logLevel: `${logLevel}`
  };
}
