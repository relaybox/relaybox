import os from 'os';
import path from 'path';
import fs from 'fs';

const DEFAULT_PROXY_PORT = 9000;
const DEFAULT_DB_PORT = 9001;
const DEFAULT_LOG_LEVEL = 'debug';

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

function getConfigFilePath() {
  const homeDir = os.homedir();
  const configFilePath = `${homeDir}/.relaybox/config.json`;

  return configFilePath;
}

export async function createGlobalConfig() {
  const configFilePath = getConfigFilePath();

  if (!fs.existsSync(configFilePath)) {
    const config = {
      proxy: {
        port: DEFAULT_PROXY_PORT
      },
      db: {
        port: DEFAULT_DB_PORT
      },
      log: {
        level: DEFAULT_LOG_LEVEL
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

export function createProcessEnv() {
  let config: Config = {};

  const configFilePath = getConfigFilePath();
  const envFilePath = path.join(__dirname, '..', '..', '.env');

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
