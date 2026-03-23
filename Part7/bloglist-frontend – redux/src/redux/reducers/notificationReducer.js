// src/redux/reducers/notificationReducer.js

const initialState = null

let timeoutId = null

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return {
        text: action.payload.text,
        type: action.payload.type,
      }
    case 'CLEAR_NOTIFICATION':
      return null
    default:
      return state
  }
}

export const setNotification = (text, seconds, type = 'success') => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_NOTIFICATION',
      payload: { text, type },
    })

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, seconds * 1000)
  }
}

export default notificationReducer
