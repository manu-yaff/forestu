import fileService from '../../files/file.service.js';

async function findAll() {
  try {
    const students = await fileService.read('./students.json');
    return students;
  } catch (error) {
    throw error;
  }
}

export default { findAll };
