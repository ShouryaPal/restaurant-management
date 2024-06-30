import axios from "axios";

export const fetchMenuItems = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/menu`);
    return response.data;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return []; 
  }
};
