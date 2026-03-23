import axios from 'axios';
import type { DiaryEntry } from '../App';

const baseUrl = 'http://localhost:3000/api/diaries';

export const getAll = async (): Promise<DiaryEntry[]> => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  return response.data;
};

export const create = async (entry: Omit<DiaryEntry, 'id'>): Promise<DiaryEntry> => {
  const response = await axios.post<DiaryEntry>(baseUrl, entry);
  return response.data;
};