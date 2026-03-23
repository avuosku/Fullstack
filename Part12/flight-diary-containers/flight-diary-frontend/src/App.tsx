import { useEffect, useState } from 'react';
import EntryForm from './EntryForm';
import { getAll } from './services/diaryService';

export type Visibility = 'great' | 'good' | 'ok' | 'poor';
export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'stormy' | 'windy';

export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}

const App = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getAll()
      .then(data => setEntries(data))
      .catch(error => {
        setError('Error fetching diary entries');
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Flight Diary</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <EntryForm onNewEntry={(entry) => setEntries(entries.concat(entry))} onError={setError} />
      <ul>
        {entries.map(entry => (
          <li key={entry.id}>
            <strong>{entry.date}</strong> — Visibility: {entry.visibility}, Weather: {entry.weather}
            {entry.comment && <div>Comment: {entry.comment}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
