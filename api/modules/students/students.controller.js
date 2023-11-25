import studentsService from './services/students.service.js';

async function findOne(req, res) {
  const { id } = req.params;

  try {
    const student = await studentsService.findOne(+id);
    res.send({ data: { student } });
  } catch (error) {
    res.send({ error: error.message });
  }
}

async function findPeriods(req, res) {
  const { id: studentId } = req.params;

  try {
    const data = await studentsService.findPeriods(+studentId);
    res.send({ data });
  } catch (error) {
    res.send({ error: error.message });
  }
}

async function findFaults(req, res) {
  const { id: studentId } = req.params;

  try {
    const data = await studentsService.findFaults(+studentId);
    res.send({ data });
  } catch (error) {
    res.send({ error: error.message });
  }
}

async function createFault(req, res) {
  const { id: studentId } = req.params;
  const { indicator, date, group_id: groupId } = req.body;

  const createFaultPayload = {
    id: 'random-string',
    student_id: +studentId,
    indicator,
    date,
    group_id: +groupId,
  };

  try {
    const data = await studentsService.createFault(createFaultPayload);
    res.send({ data });
  } catch (error) {
    res.send({ error: error.message });
  }
}

export default { findOne, findPeriods, findFaults, createFault };
