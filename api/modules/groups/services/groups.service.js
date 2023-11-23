import fileService from '../../files/file.service.js';
import studentsService from '../../students/services/students.service.js';

async function findAll() {
  try {
    const groups = await fileService.read('./groups.json');

    return { groups };
  } catch (error) {
    throw error;
  }
}

async function findOne(id) {
  try {
    const groups = await fileService.read('./groups.json');
    const group = groups.find((group) => group.id === id);

    return { group };
  } catch (error) {
    throw error;
  }
}

async function findStudents(groupId) {
  try {
    const fileStudentsJson = await fileService.read('./students_groups.json');
    const studentsIds = fileStudentsJson
      .filter((student) => {
        return student.group_id === groupId;
      })
      .map((student) => student.student_id);

    const { group } = await findOne(groupId);
    const { students } = await studentsService.findAll();
    const groupStudents = students.filter((student) => studentsIds.includes(student.id));

    return {
      group,
      students: groupStudents,
    };
  } catch (error) {
    throw error;
  }
}

export default { findAll, findOne, findStudents };
