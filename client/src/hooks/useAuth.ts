import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  email: string;
  isVerified: boolean;
  accountStatus: string;
  roles: string[];
}

const useAuth = () => {
  const token = localStorage.getItem("tooth_abode_dental_clinic_token");
  let isDentist = false;
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);

      const { id: userId, email, isVerified, accountStatus, roles } = decoded;

      isAdmin = roles.includes("Admin");
      isDentist = roles.includes("Dentist");

      return {
        userId,
        email,
        isVerified,
        accountStatus,
        roles,
        isAdmin,
        isDentist,
      };
    } catch (error) {
      console.error("Invalid or expired token:", error);
      localStorage.removeItem("tooth_abode_dental_clinic_token");
    }
  }

  return {
    userId: "",
    email: "",
    isVerified: false,
    accountStatus: "",
    roles: [],
    isAdmin,
    isDentist,
  };
};

export default useAuth;
