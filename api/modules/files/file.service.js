import fs from 'node:fs/promises';

const DB_PATH = new URL('../../../fake_database/', import.meta.url);

async function read(relativePath) {
  try {
    const filePath = new URL(relativePath, DB_PATH).pathname;
    const fileContent = await fs.readFile(filePath, 'utf-8');

    return JSON.parse(fileContent);
  } catch (error) {
    throw error;
  }
}

export default { read };
