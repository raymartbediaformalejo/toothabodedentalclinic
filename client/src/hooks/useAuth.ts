import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  email: string;
  roles: string[];
}

const useAuth = () => {
  const token = localStorage.getItem("tooth_abode_dental_clinic_token");
  let isDentist = false;
  let isAdmin = false;
  let status = "Patient";

  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);

      const { id: userId, email, roles } = decoded;

      isAdmin = roles.includes("Admin");
      isDentist = roles.includes("Dentist");

      return { userId, email, roles, status, isAdmin, isDentist };
    } catch (error) {
      console.error("Invalid or expired token:", error);
      localStorage.removeItem("tooth_abode_dental_clinic_token");
    }
  }

  return { userId: "", email: "", roles: [], isAdmin, isDentist, status };
};

export default useAuth;
