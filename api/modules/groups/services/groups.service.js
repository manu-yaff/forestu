import faultsService from '../../faults/faults.service.js';
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

async function findStudents(groupId, includeFaults) {
  const findStudentFaults = async (studentId) => {
    const faults = await faultsService.findAll();
    const studentFaults = faults.filter((fault) => fault.student_id === studentId);
    return studentFaults;
  };

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

    if (includeFaults) {
      const studentsWithFaults = await Promise.all(
        groupStudents.map(async (student) => ({
          ...student,
          faults: await findStudentFaults(student.id),
        }))
      );

      return {
        group,
        students: studentsWithFaults,
      };
    }

    return {
      group,
      students: groupStudents,
    };
  } catch (error) {
    throw error;
  }
}

function countByStatus(studentsList) {
  const total = studentsList.length;

  const red = studentsList.reduce((sum, student) => {
    if (student.status && student.status === 'red') return sum + 1;
    return sum;
  }, 0);

  const yellow = studentsList.reduce((sum, student) => {
    if (student.status && student.status === 'yellow') return sum + 1;
    return sum;
  }, 0);

  const green = total - (red + yellow);

  return [red, yellow, green];
}

async function findStudentsByStatus() {
  const { groups } = await findAll();

  const groupsWithStatus = await Promise.all(
    groups.map(async (group) => {
      const { students } = await findStudents(group.id);
      const [studentsInRed, studentsInYellow, studentsInGreen] = countByStatus(students);

      return { ...group, red: studentsInRed, yellow: studentsInYellow, green: studentsInGreen };
    })
  );
  return { groups: groupsWithStatus };
}

export default { findAll, findOne, findStudents, findStudentsByStatus };
