import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { initializeAnecdotes } from './reducers/anecdoteReducer'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'
import ErrorBoundary from './components/ErrorBoundary'

import { NotificationProvider } from './notificationContext.jsx'


const queryClient = new QueryClient()

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes()) // voit poistaa tämän jos käytät pelkkää React Queryä
  }, [dispatch])

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <ErrorBoundary>
          <div>
            <h2>Anecdotes</h2>
            <Notification />
            <Filter />
            <AnecdoteForm />
            <AnecdoteList />
          </div>
        </ErrorBoundary>
      </NotificationProvider>
    </QueryClientProvider>
  )
}

export default App
