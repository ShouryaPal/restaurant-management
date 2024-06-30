import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import useUserStore from "../../hooks/user";
import { Button } from "../ui/button";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md fixed w-full flex justify-between items-center p-4">
      <div className="flex items-center">
        <span
          className="text-2xl font-bold cursor-pointer"
          onClick={() => {
            navigate("/customer/home/");
          }}
        >
          YourRestaurant
        </span>
      </div>
      <div className="flex items-center">
        {user ? (
          <>
            <span className="text-gray-600 mr-4">{user.email}</span>
            <Button
              onClick={handleLogout}
              className="flex items-center bg-orange-500 text-white px-3 py-2 rounded-lg"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Log Out
            </Button>
          </>
        ) : (
          <button
            onClick={() => navigate("/")}
            className="bg-orange-500 text-white px-3 py-2 rounded-lg"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
