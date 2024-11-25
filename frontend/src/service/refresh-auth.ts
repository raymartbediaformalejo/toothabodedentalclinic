import { axiosInstance, setHeaderToken } from "./api";

export const fetchNewToken = async () => {
  try {
    const token: string = await axiosInstance
      .get("/auth/refresh")
      .then((res) => res.data.token);
    return token;
  } catch (error) {
    return null;
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const refreshAuth = async (failedRequest: any) => {
  try {
    const response = await axiosInstance.get("/auth/refresh");
    const { accessToken } = response.data;

    if (accessToken) {
      setHeaderToken(accessToken);
      localStorage.setItem("jwt", accessToken);
      failedRequest.response.config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return Promise.resolve();
  } catch (error) {
    console.error("Error refreshing token: ", error);
    return Promise.reject(error);
  }
};
