import file from '../../files/file.service.js';
import studentsService from '../../students/services/students.service.js';

async function find(_, res) {
  try {
    const fileContent = await file.read('./groups.json');
    res.send({ data: fileContent });
  } catch (error) {
    res.send({ error: error.message });
  }
}

async function findStudents(req, res) {
  const groupId = +req.params.id;
  try {
    const fileStudentsJson = await file.read('./students_groups.json');
    const studentsIds = fileStudentsJson
      .filter((student) => {
        return student.group_id === groupId;
      })
      .map((student) => student.student_id);

    const students = await studentsService.find();
    const groupStudents = students.filter((student) => studentsIds.includes(student.id));

    res.send({ data: groupStudents });
  } catch (error) {
    res.send({ error: error.message });
  }
}

export default { find, findStudents };
