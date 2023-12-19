import AsyncStorage from "@react-native-async-storage/async-storage";

import { AUTH_TOKEN_STORE } from "./storageConfig";

export async function storageAuthStorageSave(token: string) {
  await AsyncStorage.setItem(AUTH_TOKEN_STORE, token);
}

export async function storageAuthTokenGet() {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_STORE);

  return token;
}
export async function storageAuthTokenRemove() {
  await AsyncStorage.removeItem(AUTH_TOKEN_STORE);
}
