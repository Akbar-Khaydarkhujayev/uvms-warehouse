import axiosInstance, { baseURL } from 'src/utils/axios';

export const getImage = async (user_index: number, base64 = false) => {
  try {
    const response = await axiosInstance.get(
      `${baseURL}Files/user_image?user_index=${user_index}`,
      {
        responseType: 'blob',
      }
    );

    if (base64) {
      const base64String = await convertBlobToBase64(response.data);
      return base64String;
    }
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
};

const convertBlobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
