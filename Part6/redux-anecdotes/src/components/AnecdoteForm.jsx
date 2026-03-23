import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import anecdoteService from '../services/anecdotes'
import { useNotification, setNotificationWithTimeout } from '../notificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const { dispatch } = useNotification()

  const newAnecdoteMutation = useMutation({
    mutationFn: anecdoteService.createNew,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      setNotificationWithTimeout(dispatch)(`You added: "${newAnecdote.content}"`, 5)
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'Something went wrong'
      setNotificationWithTimeout(dispatch)(errorMessage, 5)
    }
  })

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value.trim()
    event.target.anecdote.value = ''
  
    if (content.length < 5) {
      setNotificationWithTimeout(dispatch)('Too short anecdote, must be at least 5 characters', 5)
      return
    }
  
    newAnecdoteMutation.mutate(content)
  }

  return (
    <form onSubmit={addAnecdote}>
      <input name="anecdote" />
      <button type="submit">add</button>
    </form>
  )
}

export default AnecdoteForm
