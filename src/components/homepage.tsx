import { User, UserCog } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  const handleCustomerLogin = () => {
    navigate("/customer/signin");
  };

  const handleStaffLogin = () => {
    navigate("/staff/auth");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-16 py-4 sm:py-0">
            <div className="flex-shrink-0 flex items-center mb-4 sm:mb-0">
              <span className="text-xl sm:text-2xl font-bold text-gray-800">
                YourRestaurant
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm sm:text-base text-gray-600">
                Welcome to our restaurant
              </span>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
              Choose your login
            </h2>
          </div>
          <div className="mt-8 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={handleCustomerLogin}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <User className="mr-2 h-5 w-5" />
                Customer Login
              </Button>
              <Button
                onClick={handleStaffLogin}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <UserCog className="mr-2 h-5 w-5" />
                Staff Login
              </Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white mt-auto">
        <div className=" mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs sm:text-sm text-gray-500">
            © {new Date().getFullYear()} YourRestaurant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
