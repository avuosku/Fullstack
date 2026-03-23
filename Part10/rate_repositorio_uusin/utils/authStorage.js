// src/utils/authStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'accessToken';

class AuthStorage {
  async getAccessToken() {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  }

  async setAccessToken(accessToken) {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  async removeAccessToken() {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export default AuthStorage;
