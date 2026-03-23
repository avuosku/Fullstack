import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import anecdoteService from '../services/anecdotes'
import { useNotification } from '../notificationContext'
import { useSelector } from 'react-redux'

const AnecdoteList = () => {
  const queryClient = useQueryClient()
  const { dispatch } = useNotification()
  const [loadingId, setLoadingId] = useState(null) // Seuraa, mikä anekdootti on parhaillaan äänestettävänä

  // Hae suodattimen arvo Redux-tilasta
  const filter = useSelector(state => state.filter)

  // Haetaan anekdootit
  const { data: anecdotes, isLoading, error } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteService.getAll,
    retry: 1,
    onError: (err) => {
      console.error("Virhe anekdoottien hakemisessa:", err)
      dispatch({ type: 'SET', payload: 'Virhe anekdoottien hakemisessa.' })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
    }
  })

  // Äänestysmutaatio
  const { mutate } = useMutation({
    mutationFn: anecdoteService.vote,
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries(['anecdotes'])
      dispatch({ type: 'SET', payload: `Äänestit anekdoottia: '${updatedAnecdote.content}'` })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
      setLoadingId(null) // Poistetaan äänestettävän anekdootin ID, kun äänestys on valmis
    },
    onError: (error) => {
      console.error("Virhe äänestyksessä:", error)
      dispatch({ type: 'SET', payload: `Virhe äänestyksessä: ${error.message}` })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
      setLoadingId(null) // Poistetaan äänestettävän anekdootin ID virheen jälkeen
    }
  })

  const handleVote = (anecdote) => {
    if (loadingId === anecdote.id) {
      console.log("Äänestys jo käynnissä tälle anekdootille.")
      return
    }

    // Tarkistetaan, että anekdoottia ei ole jo äänestetty
    if (anecdote.votes === undefined) {
      console.error("Virhe: Anekdootilla ei ole ääniä")
      return
    }

    setLoadingId(anecdote.id)  // Asetetaan anekdootti äänestettäväksi

    // Käytetään optimistic UI -mallia
    const optimisticUpdate = { ...anecdote, votes: anecdote.votes + 1 }
    queryClient.setQueryData(['anecdotes'], (oldData) => {
      return oldData.map((a) =>
        a.id === anecdote.id ? optimisticUpdate : a
      )
    })

    mutate(anecdote)  // Suoritetaan äänestys
  }

  if (isLoading) {
    return <div>Ladataan anekdootteja...</div>
  }

  if (error) {
    return <div>Virhe palvelimen kanssa, yritä myöhemmin.</div>
  }

  return (
    <div>
      {anecdotes
        .filter(a => a.content.toLowerCase().includes(filter.toLowerCase())) // Suodatus hakutekstin perusteella
        .sort((a, b) => b.votes - a.votes) // Anekdootit äänimäärän mukaan laskevassa järjestyksessä
        .map(anecdote => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes} votes
              <button onClick={() => handleVote(anecdote)} disabled={loadingId === anecdote.id}>vote</button>
            </div>
          </div>
        ))}
    </div>
  )
}

export default AnecdoteList
