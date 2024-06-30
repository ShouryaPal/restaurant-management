import SignIn from "./components/customer/authentication/sign-in";
import SignUp from "./components/customer/authentication/sign-up";
import Homepage from "./components/homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import CustomerHome from "./components/customer/home/home";
import StaffSignIn from "./components/staff/auth/sign-in";
import MenuItems from "./components/customer/home/menu";
import Checkout from "./components/customer/home/checkout";
import StaffHome from "./components/staff/home";

const queryClient = new QueryClient();
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/customer/signin/" element={<SignIn />} />
            <Route path="/customer/signup/" element={<SignUp />} />
            <Route path="/customer/home/" element={<CustomerHome />} />
            <Route path="/customer/menu/" element={<MenuItems />} />
            <Route path="/customer/order/" element={<Checkout />} />
            <Route path="/staff/auth/" element={<StaffSignIn />} />
            <Route path="/staff/home/" element={<StaffHome />} />
          </Routes>
        </Router>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}

export default App;
