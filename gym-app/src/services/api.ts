import {
  storageAuthStorageSave,
  storageAuthTokenGet,
} from "@storage/storageAuthToken";
import { AppError } from "@utils/AppError";
import axios, { AxiosError, AxiosInstance } from "axios";

type SignOut = () => void;

type PromiseType = {
  onSucess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
};

type ApiinstancePorps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => void;
};

const api = axios.create({
  baseURL: "http://192.168.2.110:3333/",
}) as ApiinstancePorps;

let failedQueue: PromiseType[] = [];
let isRefresing = false;

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager =
    /* intercepta todas as response feitas para a api, naquela baseUrl */
    api.interceptors.response.use(
      (response) => response,
      async (requestError) => {
        if (requestError?.response?.status === 401) {
          if (
            requestError.response.data?.message === "token.expired" ||
            requestError.response.data?.message === "token.invald"
          ) {
            const { refresh_token } = await storageAuthTokenGet();

            if (!refresh_token) {
              signOut();
              return Promise.reject(requestError);
            }

            const originalRequestConfig = requestError.config;

            if (isRefresing) {
              return new Promise((resolve, reject) => {
                failedQueue.push({
                  onSucess: (token: string) => {
                    originalRequestConfig.headers = {
                      Authorization: `Bearer ${token}`,
                    };
                    resolve(api(originalRequestConfig));
                  },
                  onFailure: (error: AxiosError) => {
                    reject(error);
                  },
                });
              });
            }

            isRefresing = true;

            return new Promise(async (resolve, reject) => {
              try {
                const { data } = await api.post("/sessions/refresh-token", {
                  refresh_token,
                });

                await storageAuthStorageSave({
                  token: data.token,
                  refresh_token: data.rrefresh_token,
                });

                if (originalRequestConfig.data) {
                  originalRequestConfig.data = JSON.parse(
                    originalRequestConfig
                  );
                }

                originalRequestConfig.headers = {
                  Authorization: `Bearer ${data.token}`,
                };

                api.defaults.headers.common[
                  "Authorization"
                ] = `Bearer ${data.token}`;

                failedQueue.forEach((request) => {
                  request.onSucess(data.token);
                });

                resolve(api(originalRequestConfig));
              } catch (error: any) {
                failedQueue.forEach((request) => {
                  request.onFailure(error);
                });

                signOut();
                reject(error);
              } finally {
                isRefresing = false;
                failedQueue = [];
              }
            });
          }

          signOut();
        }

        /* rejeitar a promise e como se fosse o throw que joga o erro para cima para ser tratado em outro lugar
        nesse caso ele joga a promise rejeitada para quem chamou ela

        esse bloco espeficico ela joga para quem chamou a requisição usando axios naquela base url da const api
        return Promise.reject(requestError);
    */
        if (requestError.response && requestError.response.data) {
          return Promise.reject(
            new AppError(requestError.response.data.message)
          );
        } else {
          return Promise.reject(requestError);
        }
      }
    );

  return () => {
    /* depois de usar o interceptor faz um eject para com essa função criada, caso ele nao consiga um token atualizado. */
    api.interceptors.response.eject(interceptTokenManager);
  };
};

export { api };
