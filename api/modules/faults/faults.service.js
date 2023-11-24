import fileService from '../files/file.service.js';

async function findAll() {
  try {
    const faults = await fileService.read('./faults.json');

    return faults;
  } catch (error) {
    throw error;
  }
}

export default { findAll };
