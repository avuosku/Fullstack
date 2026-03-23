import express from 'express';
import { v1 as uuid } from 'uuid';
import patients from '../data/patients';
import { Patient } from '../types';
import { newPatientSchema } from '../utils/validators';

const router = express.Router();

// ✅ GET /api/patients — kaikki potilaat (voit valita, sisällytetäänkö SSN)
router.get('/', (_req, res) => {
  const safePatients = patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
  res.json(safePatients);

  // Jos haluat palauttaa kaikki kentät (ml. SSN), käytä tätä sen sijaan:
  // res.json(patients);
});

// ✅ GET /api/patients/:id — yksittäinen potilas id:n perusteella
router.get('/:id', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  return res.json(patient);
});

// ✅ POST /api/patients — uuden potilaan lisääminen
router.post('/', (req, res) => {
  try {
    const validatedPatient = newPatientSchema.parse(req.body);
    const newPatient: Patient = {
      id: uuid(),
      ...validatedPatient,
      entries: []
    };
    patients.push(newPatient);
    res.status(201).json(newPatient);
  } catch (error) {
    if (error instanceof Error && 'errors' in error) {
      return res.status(400).json({ error: (error as any).errors });
    }
    return res.status(400).json({ error: 'Invalid patient data' });
  }
});

router.post('/:id/entries', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  try {
    const validatedEntry = newEntrySchema.parse(req.body);
    const newEntry: Entry = {
      id: uuid(), // tai käytä v1() kuten muissa
      ...validatedEntry
    };

    patient.entries.push(newEntry);
    res.status(201).json(newEntry);
  } catch (error: unknown) {
    if (error instanceof Error && 'errors' in error) {
      return res.status(400).json({ error: (error as any).errors });
    }
    return res.status(400).json({ error: 'Invalid entry data' });
  }
});

export default router;
