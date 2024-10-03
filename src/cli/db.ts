import { AppDataSource } from '../database/data-source';

interface DbOptions {
  synchronize?: boolean;
}

export async function initialize({ synchronize = false }: DbOptions = {}) {
  AppDataSource.setOptions({ synchronize });
  await AppDataSource.initialize();
}

export async function end() {
  AppDataSource.setOptions({ synchronize: false });
  await AppDataSource.destroy();
}
