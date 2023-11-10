import file from '../../files/file.service.js';

async function find(_, res) {
  try {
    const fileContent = await file.read('./groups.json');
    res.send({ data: fileContent });
  } catch (error) {
    res.send({ error: error.message });
  }
}

export default { find };
