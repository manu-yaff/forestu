import fileService from '../../files/file.service.js';

async function findAll(_, res) {
  try {
    const fileContent = await fileService.read('./groups.json');
    res.send({ data: fileContent });
  } catch (error) {
    res.send({ error: error.message });
  }
}

export default { findAll };
