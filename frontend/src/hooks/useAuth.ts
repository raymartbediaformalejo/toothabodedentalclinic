import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = localStorage.getItem("jwt");
  let isAdmin = false;

  if (token) {
    const decoded = jwtDecode(token);
    // @ts-expect-error: Unreachable code error
    const { userId, email, roles } = decoded.UserInfo;

    isAdmin = roles.includes("Admin");

    return { userId, email, roles, isAdmin };
  }

  return { userId: "", email: "", roles: [], isAdmin };
};
export default useAuth;
