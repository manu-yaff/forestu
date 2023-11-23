import fileService from '../../files/file.service.js';
import studentsService from '../../students/services/students.service.js';

async function findOne(id) {
  try {
    const groups = await fileService.read('./groups.json');
    return groups.find((group) => group.id === id);
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

    const students = await studentsService.findAll();
    const groupStudents = students.filter((student) => studentsIds.includes(student.id));
    const group = await findOne(groupId);

    return {
      group,
      students: groupStudents,
    };
  } catch (error) {
    throw error;
  }
}

export default { findOne, findStudents };
