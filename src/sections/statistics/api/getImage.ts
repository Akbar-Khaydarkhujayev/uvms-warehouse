import axiosInstance, { baseURL } from 'src/utils/axios';

export const getImage = (id: number) =>
  axiosInstance.get(`${baseURL}Files/log_files?log_id=${id}`).then((res) => res.data);
