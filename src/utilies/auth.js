export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUser = () => {
  return localStorage.getItem("userData");
}

export const getRole = () => {
  if(!localStorage.getItem("role")) {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      return parsedUserData.role;
    }
  }
  return localStorage.getItem("role");
};

export const isAdmin = () => {
  return getRole() === "ADMIN";
};

export const isDoctor = () => {
  return getRole() === "HEALTHCARE";
}

export const isUser = () => {
  return getRole() !== "ADMIN";
};