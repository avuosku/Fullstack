// src/EntryForm.tsx
import { useState } from 'react';
import axios from 'axios';
import type { DiaryEntry, Visibility, Weather } from './App';

interface Props {
  onNewEntry: (entry: DiaryEntry) => void;
  onError: (message: string) => void;
}

const EntryForm = ({ onNewEntry, onError }: Props) => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>('sunny');
  const [visibility, setVisibility] = useState<Visibility>('great');
  const [comment, setComment] = useState('');

  const addEntry = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post<DiaryEntry>('http://localhost:3000/api/diaries', {
        date, weather, visibility, comment
      });

      onNewEntry(response.data);
      setDate('');
      setWeather('sunny');
      setVisibility('great');
      setComment('');
      onError('');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        onError(error.response.data);
      } else {
        onError('Unknown error occurred');
      }
    }
  };

  return (
    <form onSubmit={addEntry}>
      <h2>Add new entry</h2>
      <div>
        Date: <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      <div>
        Weather:
        {['sunny', 'rainy', 'cloudy', 'stormy', 'windy'].map(w => (
          <label key={w}>
            <input
              type="radio"
              name="weather"
              value={w}
              checked={weather === w}
              onChange={() => setWeather(w as Weather)}
            />
            {w}
          </label>
        ))}
      </div>
      <div>
        Visibility:
        {['great', 'good', 'ok', 'poor'].map(v => (
          <label key={v}>
            <input
              type="radio"
              name="visibility"
              value={v}
              checked={visibility === v}
              onChange={() => setVisibility(v as Visibility)}
            />
            {v}
          </label>
        ))}
      </div>
      <div>
        Comment:
        <input type="text" value={comment} onChange={e => setComment(e.target.value)} />
      </div>
      <button type="submit">Add</button>
    </form>
  );
};

export default EntryForm;
