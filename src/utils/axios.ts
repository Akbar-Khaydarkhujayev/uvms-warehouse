import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export const baseURL = `${CONFIG.serverUrl}/api/`;

const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: 'chat',
  kanban: 'kanban',
  calendar: 'calendar',
  auth: {
    me: 'auth/me',
    signIn: 'User/login',
    signUp: 'User/register',
  },
  companies: {
    list: 'Companys',
    delete: (id: string) => `Companys?company_id=${id}`,
    create: (name: string) => `Companys?company_name=${name}`,
    edit: (id: string, name: string) => `Companys?company_id=${id}&company_name=${name}`,
    stats: 'Stat/companys',
  },
  device: {
    list: 'Device/devices',
    delete: (id: string) => `Device/device?device_id=${id}`,
    create: 'Device/device',
    edit: (id: string) => `Device/device?device_id=${id}`,
    user: {
      list: 'Device/device/GetUsers',
      delete: 'Device/device/DeleteUser',
      create: 'Device/device/addUser',
      edit: 'Device/device/editUser',
    },
  },
  report: 'report',
};
