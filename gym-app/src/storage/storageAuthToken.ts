import AsyncStorage from "@react-native-async-storage/async-storage";

import { AUTH_TOKEN_STORE } from "./storageConfig";

export async function storageAuthStorageSave(token: string) {
  await AsyncStorage.setItem(AUTH_TOKEN_STORE, token);
}
