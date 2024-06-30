import { useEffect, useState } from "react";
import useUserStore from "../../../hooks/user";
import { Menu, ShoppingCart, CreditCard, Clock } from "lucide-react";
import Navbar from "../navbar";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  tableNumber: number;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "preparing" | "ready" | "delivered";
  email: string;
  createdAt: string;
}

interface User {
  name: string;
  email: string;
}

const CustomerHome = () => {
  const { user } = useUserStore() as { user: User | null };
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingOrders = async () => {
      if (user && user.email) {
        try {
          setIsLoading(true);
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/order/pending/${user.email}`
          );
          if (response.ok) {
            const data: Order[] = await response.json();
            setPendingOrders(data);
          } else {
            console.error("Failed to fetch pending orders");
          }
        } catch (error) {
          console.error("Error fetching pending orders:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPendingOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">Please sign in to see the menu.</p>
      </div>
    );
  }

  const navigateToMenu = () => navigate("/customer/menu");
  const navigateToOrder = () => navigate("/customer/order");

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-20 flex flex-col items-center gap-10">
        <h1 className="text-4xl mt-10 sm:text-5xl font-bold text-gray-800">
          Welcome, {user.name}! 👋
        </h1>
        <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={navigateToMenu}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              <Menu className="w-12 h-12 md:w-16 md:h-16 text-orange-500 mb-4" />
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
                Menu
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Explore our delicious menu.
              </p>
            </div>
            <div
              onClick={navigateToOrder}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              <ShoppingCart className="w-12 h-12 md:w-16 md:h-16 text-orange-500 mb-4" />
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
                Cart
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                View items in your cart.
              </p>
            </div>
            <div
              onClick={navigateToOrder}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              <CreditCard className="w-12 h-12 md:w-16 md:h-16 text-orange-500 mb-4" />
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
                Checkout
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Proceed to checkout.
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-xl font-semibold text-gray-600">
            Loading orders...
          </div>
        ) : pendingOrders.length > 0 ? (
          <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Pending Orders
            </h2>
            {pendingOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow-md rounded-lg p-6 mb-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">
                    Table #{order.tableNumber}
                  </span>
                  <span className="text-orange-500 flex items-center">
                    <Clock className="inline-block mr-1" size={16} />
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <ul className="mb-2">
                  {order.items.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between text-gray-700"
                    >
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="mt-2 text-green-600 font-semibold">
                  Status: {order.status}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-orange-100 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-orange-600 mb-4">
              No Pending Orders
            </h2>
            <p className="text-xl text-gray-700">
              Place your order now and enjoy our delicious meals!
            </p>
            <button
              className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition duration-300"
              onClick={navigateToMenu}
            >
              View Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHome;
