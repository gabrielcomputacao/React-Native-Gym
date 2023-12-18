import { AppError } from "@utils/AppError";
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.2.110:3333/",
});

/* intercepta todas as response feitas para a api, naquela baseUrl */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    /* rejeitar a promise e como se fosse o throw que joga o erro para cima para ser tratado em outro lugar
        nesse caso ele joga a promise rejeitada para quem chamou ela

        esse bloco espeficico ela joga para quem chamou a requisição usando axios naquela base url da const api
        return Promise.reject(error);
    */

    if (error.response && error.response.data) {
      return Promise.reject(new AppError(error.response.data.message));
    } else {
      return Promise.reject(error);
    }
  }
);

export { api };
