import AsyncStorage from "@react-native-async-storage/async-storage";

import { AUTH_TOKEN_STORE } from "./storageConfig";

type storageAuthTokenProps = {
  token: string;
  refresh_token: string;
};

export async function storageAuthStorageSave({
  token,
  refresh_token,
}: storageAuthTokenProps) {
  await AsyncStorage.setItem(
    AUTH_TOKEN_STORE,
    JSON.stringify({ token, refresh_token })
  );
}

export async function storageAuthTokenGet() {
  const response = await AsyncStorage.getItem(AUTH_TOKEN_STORE);

  const { token, refresh_token }: storageAuthTokenProps = response
    ? JSON.parse(response)
    : {};

  return { token, refresh_token };
}
export async function storageAuthTokenRemove() {
  await AsyncStorage.removeItem(AUTH_TOKEN_STORE);
}
