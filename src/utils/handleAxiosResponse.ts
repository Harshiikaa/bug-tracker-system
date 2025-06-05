import axios from 'axios';

export const handleAxiosResponse = async <T>(promise: Promise<any>): Promise<T> => {
  try {
    const response = await promise;

    // If backend responds with success === false
    if (!response.data.success) {
      const message = response.data.message || "Something went wrong";
      throw new Error(message);
    }

    return response.data.data as T;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unknown error occurred";
    throw new Error(message);
  }
};
