const messageReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_SUCCESS_MESSAGE':
      return { type: 'success', text: action.data };
    case 'SET_ERROR_MESSAGE':
      return { type: 'error', text: action.data };
    case 'CLEAR_MESSAGES':
      return '';
    default:
      return state;
  }
};

export const setSuccessMessage = (message) => {
  return {
    type: 'SET_SUCCESS_MESSAGE',
    data: message,
  };
};

export const setErrorMessage = (message) => {
  return {
    type: 'SET_ERROR_MESSAGE',
    data: message,
  };
};

export const clearMessages = () => {
  return {
    type: 'CLEAR_MESSAGES',
  };
};

export default messageReducer;
