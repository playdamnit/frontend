import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const AXIOS_INSTANCE = axios.create({
  withCredentials: true,
});

export const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return AXIOS_INSTANCE({
    ...config,
    ...options,
  });
};
