import React, { createContext, useContext, useReducer } from 'react';

const NotificationContext = createContext();

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload;
    case 'CLEAR':
      return null;
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null);

  return (
    <NotificationContext.Provider value={{ notification, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationValue = () => {
  const { notification } = useContext(NotificationContext);
  return notification;
};

export const useNotification = () => {
  const { notification, dispatch } = useContext(NotificationContext);
  return { notification, dispatch };
};

export const setNotificationWithTimeout = (dispatch) => (message, seconds) => {
  dispatch({ type: 'SET', payload: message });
  setTimeout(() => {
    dispatch({ type: 'CLEAR' });
  }, seconds * 1000);
};
