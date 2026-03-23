// src/hooks/useAuthStorage.js

import AuthStorage from '../utils/authStorage';

const authStorage = new AuthStorage();

const useAuthStorage = () => {
  return authStorage;
};

export default useAuthStorage;
