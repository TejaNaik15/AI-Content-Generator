import api from '../axiosConfig';


export const registerAPI = async (userData) => {
  try {
    const response = await api.post(
      "/api/v1/users/register",
      {
        email: userData?.email,
        password: userData?.password,
        username: userData?.username,
      }
    );
    return response?.data;
  } catch (err) {
    if (!err.response) throw new Error('Network error: failed to reach server');
    throw err;
  }
};


export const loginAPI = async (userData) => {
  try {
    const response = await api.post(
      "/api/v1/users/login",
      {
        email: userData?.email,
        password: userData?.password,
      }
    );
    return response?.data;
  } catch (err) {
    if (!err.response) throw new Error('Network error: failed to reach server');
    throw err;
  }
};


export const checkUserAuthStatusAPI = async () => {
  try {
    const response = await api.get(
      "/api/v1/users/auth/check"
    );
    return response?.data;
  } catch (err) {
    if (!err.response) throw new Error('Network error: failed to reach server');
    throw err;
  }
};


export const logoutAPI = async () => {
  try {
    const response = await api.post(
      "/api/v1/users/logout",
      {}
    );
    return response?.data;
  } catch (err) {
    if (!err.response) throw new Error('Network error: failed to reach server');
    throw err;
  }
};


export const getUserProfileAPI = async () => {
  try {
    const response = await api.get(
      "/api/v1/users/profile"
    );
    return response?.data;
  } catch (err) {
    if (!err.response) throw new Error('Network error: failed to reach server');
    throw err;
  }
};
