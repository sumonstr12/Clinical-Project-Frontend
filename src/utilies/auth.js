export const getToken = () => {
  return localStorage.getItem("token");
};

export const getRole = () => {
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