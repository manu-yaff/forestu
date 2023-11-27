import faultsService from '../../faults/faults.service.js';
import fileService from '../../files/file.service.js';
import periodsService from '../../periods/services/periods.service.js';

const studentIndicators = {
  Inasistencia: {
    numberFaults: 0,
    faults: [],
  },
  Puntualidad: {
    numberFaults: 0,
    faults: [],
  },
  'Respeto a sus compañeros': {
    numberFaults: 0,
    faults: [],
  },
};

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
            numberFaults: 1,
            faults: [...[{ indicator, date }]],
          },
        };
      }

      const { numberFaults, faults } = store[indicator];
      const newFaults = numberFaults + 1;

      return {
        ...store,
        [indicator]: {
          numberFaults: newFaults,
          faults: [...faults, { indicator, date }],
        },
      };
    }, {});

    return {
      student_id: studentId,
      faults_by_indicator:
        Object.keys(faultsByIndicator).length > 0
          ? { ...studentIndicators, ...faultsByIndicator }
          : studentIndicators,
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
