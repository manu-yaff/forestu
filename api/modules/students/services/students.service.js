import fileService from '../../files/file.service.js';

async function find() {
  try {
    const students = await fileService.read('./students.json');
    return students;
  } catch (error) {
    throw error;
  }
}

export default { find };
