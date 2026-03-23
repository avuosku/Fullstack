import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    updateAnecdote(state, action) {
      const updated = action.payload
      return state
        .map(a => a.id === updated.id ? updated : a)
        .sort((a, b) => b.votes - a.votes)
    },
    addAnecdote(state, action) {
      state.push(action.payload)
      return state.sort((a, b) => b.votes - a.votes)
    },
    setAnecdotes(state, action) {
      return action.payload.sort((a, b) => b.votes - a.votes)
    }
  }
})

export const { updateAnecdote, addAnecdote, setAnecdotes } = anecdoteSlice.actions

// Haetaan kaikki anekdootit backendistä
export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

// Luodaan uusi anekdootti backendin kautta
export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(addAnecdote(newAnecdote))
  }
}

// Äänestetään anekdoottia ja päivitetään se backendissä
export const voteAnecdote = (id) => {
  return async (dispatch, getState) => {
    const anecdoteToChange = getState().anecdotes.find(a => a.id === id)
    if (!anecdoteToChange) return
    const updated = { ...anecdoteToChange, votes: anecdoteToChange.votes + 1 }
    const returned = await anecdoteService.update(updated.id, updated)
    dispatch(updateAnecdote(returned))
  }
}

export default anecdoteSlice.reducer
