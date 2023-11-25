import faultsService from '../../faults/faults.service.js';
import fileService from '../../files/file.service.js';
import periodsService from '../../periods/services/periods.service.js';

async function findAll() {
  try {
    const students = await fileService.read('./students.json');

    return { students };
  } catch (error) {
    throw error;
  }
}

async function findOne(id) {
  try {
    const students = await fileService.read('./students.json');
    const student = students.find((student) => student.id === id);

    return { student };
  } catch (error) {
    throw error;
  }
}

async function findPeriods(studentId) {
  try {
    const { periods } = await periodsService.findAll();
    const studentPeriods = periods.filter((period) => period.student_id == studentId);

    return { student_id: studentId, periods: studentPeriods };
  } catch (error) {
    throw error;
  }
}

async function findFaults(studentId) {
  try {
    const faults = await faultsService.findAll();
    const studentFaults = faults.filter((fault) => fault.student_id === studentId);

    const faultsByIndicator = studentFaults.reduce((store, { indicator, date }) => {
      if (!store.hasOwnProperty(indicator)) {
        return {
          ...store,
          [indicator]: {
            status: 'yellow',
            faults: 1,
            dates: [date],
          },
        };
      }

      const { faults, dates } = store[indicator];
      const newFaults = faults + 1;

      return {
        ...store,
        [indicator]: {
          status: newFaults > 2 ? 'red' : 'yellow',
          faults: newFaults,
          dates: [...dates, date],
        },
      };
    }, {});

    return {
      student_id: studentId,
      faults_by_indicator: faultsByIndicator,
    };
  } catch (error) {
    throw error;
  }
}

async function updateStudentStatus(studentId, status) {
  try {
    const { student: targetStudent } = await findOne(studentId);
    const updatedStudent = { ...targetStudent, status };
    const { students } = await findAll();
    const updatedStudentsList = students.map((student) =>
      student.id === targetStudent.id ? updatedStudent : student
    );

    await fileService.overwrite('./students.json', updatedStudentsList);
  } catch (error) {
    throw error;
  }
}

async function createFault(faultPayload) {
  const { student_id } = faultPayload;

  try {
    const createdFault = await fileService.write('./faults.json', faultPayload);

    const faults = await faultsService.findAll();
    const studentFaults = faults.filter((fault) => fault.student_id === student_id);

    const studentStatus = studentFaults.length >= 3 ? 'red' : 'yellow';

    await updateStudentStatus(student_id, studentStatus);

    return { fault: createdFault };
  } catch (error) {
    throw error;
  }
}

export default { findAll, findOne, findPeriods, findFaults, createFault };
