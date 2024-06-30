import create from "zustand";
import axios from "axios";

export interface User {
  _id: string;
  email: string;
  isStaff: boolean; 
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  refetchUser: () => Promise<User | null>;
  logout: () => void;
  loginAsStaff: (email: string, password: string) => Promise<User | null>; 
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  refetchUser: async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/customer/auth/refetch`,
        {
          withCredentials: true,
        }
      );
      set({ user: response.data });
      return response.data;
    } catch (error) {
      console.error("Error refetching user:", error);
      set({ user: null });
      return null;
    }
  },
  logout: async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_API_URL}/api/customer/auth/logout`,
        {
          withCredentials: true,
        }
      );
      set({ user: null });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  },
  loginAsStaff: async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/staff/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      const staffUser = { ...response.data, isStaff: true };
      set({ user: staffUser });
      return staffUser;
    } catch (error) {
      console.error("Error logging in as staff:", error);
      return null;
    }
  },
}));

useUserStore.getState().refetchUser();

export default useUserStore;
