import fileService from '../../files/file.service.js';

async function findAll() {
  try {
    const periods = await fileService.read('./periods.json');

    return { periods };
  } catch (error) {
    throw error;
  }
}

export default { findAll };
