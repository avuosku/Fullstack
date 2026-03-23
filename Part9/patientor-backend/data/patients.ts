import { Patient, Gender, EntryType, HealthCheckRating } from '../types';

const patients: Patient[] = [
  {
    id: 'd277333e-f723-11e9-8f0b-362b9e155667',
    name: 'John McClane',
    dateOfBirth: '1986-07-09',
    ssn: '090786-122X',
    gender: Gender.Male,
    occupation: 'New York City cop',
    entries: [
      {
        id: '1',
        date: '2024-01-01',
        type: EntryType.HealthCheck,
        specialist: 'Dr. House',
        description: 'Routine health checkup.',
        diagnosisCodes: ['Z00.0'],
        healthCheckRating: HealthCheckRating.Healthy
      }
    ]
  },
  {
    id: 'd27735ce-f723-11e9-8f0b-362b9e155667',
    name: 'Jane Doe',
    dateOfBirth: '1990-01-01',
    ssn: '010190-999Y',
    gender: Gender.Female,
    occupation: 'Teacher',
    entries: [
      {
        id: '2',
        date: '2024-02-15',
        type: EntryType.Hospital,
        specialist: 'Dr. Strange',
        description: 'Appendectomy after acute appendicitis.',
        diagnosisCodes: ['K35.2'],
        discharge: {
          date: '2024-02-20',
          criteria: 'No signs of infection'
        }
      }
    ]
  }
];

export default patients;
