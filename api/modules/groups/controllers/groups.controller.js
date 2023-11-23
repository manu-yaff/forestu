import fileService from '../../files/file.service.js';
import groupsService from '../services/groups.service.js';

async function findAll(_, res) {
  try {
    const data = await groupsService.findAll();
    res.send({ data });
  } catch (error) {
    res.send({ error: error.message });
  }
}

async function findStudents(req, res) {
  const { id: groupId } = req.params;
  try {
    const data = await groupsService.findStudents(+groupId);
    res.send({ data });
  } catch (error) {
    res.send({ error: error.message });
  }
}

export default { findAll, findStudents };
