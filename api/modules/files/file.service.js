import fs from 'node:fs/promises';

const DB_PATH = new URL('../../../fake_database/', import.meta.url);

async function read(relativePath) {
  try {
    const filePath = new URL(relativePath, DB_PATH).pathname;
    const fileContent = await fs.readFile(filePath, 'utf-8');

    return JSON.parse(fileContent || JSON.stringify([]));
  } catch (error) {
    throw error;
  }
}

async function write(relativePath, payload) {
  try {
    const filePath = new URL(relativePath, DB_PATH).pathname;
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent || JSON.stringify([]));

    jsonData.push(payload);

    const newItem = jsonData[jsonData.length - 1];
    const updatedJsonData = JSON.stringify(jsonData, null, 2);

    await fs.writeFile(filePath, updatedJsonData, 'utf-8');

    return newItem;
  } catch (error) {
    throw error;
  }
}

async function overwrite(relativePath, payload) {
  try {
    const filePath = new URL(relativePath, DB_PATH).pathname;
    const jsonFormattedPayload = JSON.stringify(payload, null, 2);
    console.log(jsonFormattedPayload);

    await fs.writeFile(filePath, jsonFormattedPayload, 'utf-8');
  } catch (error) {
    throw error;
  }
}

export default { read, write, overwrite };
