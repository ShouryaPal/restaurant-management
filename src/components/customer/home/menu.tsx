import { useQuery } from "@tanstack/react-query";
import { fetchMenuItems } from "../../../lib/server";
import Navbar from "../navbar";
import { useState, useCallback } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import useCartStore from "../../../hooks/useCartStore";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import useUserStore from "../../../hooks/user";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const MenuItems = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const {
    data: menuItems,
    isLoading,
    isError,
  } = useQuery<MenuItem[]>({ queryKey: ["menu"], queryFn: fetchMenuItems });

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const addItem = useCartStore((state) => state.addItem);

  const handleQuantityChange = useCallback(
    (itemId: string, newQuantity: number) => {
      setQuantities((prev) => ({
        ...prev,
        [itemId]: Math.max(0, newQuantity),
      }));
    },
    []
  );

  const handleAddToCart = useCallback(
    (item: MenuItem) => {
      const quantity = quantities[item._id] || 0;
      if (quantity > 0) {
        addItem({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity,
        });
        setQuantities((prev) => ({ ...prev, [item._id]: 0 }));
        toast.success(
          `Added ${quantity} ${quantity > 1 ? "items" : "item"} of ${
            item.name
          } to cart`,
          {
            description: `Enjoy your delicious ${item.category}!`,
          }
        );
      }
    },
    [quantities, addItem]
  );

  const getButtonClass = useCallback((quantity: number) => {
    return quantity > 0
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "bg-gray-300 text-gray-700 cursor-not-allowed";
  }, []);

  const handleProceed = () => {
    navigate("/customer/order");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">Please sign in to see the menu.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Toaster />
      <div className="container mx-auto px-4 mt-28 flex-grow">
        <h1 className="text-4xl font-bold text-center mb-8">Menu</h1>
        <div className="bg-gray-100 p-4 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to Order:</h2>
          <ol className="list-decimal list-inside">
            <li className="mb-2">Select your dish from the menu below</li>
            <li className="mb-2">Choose the quantity for each item</li>
            <li className="mb-2">
              Click "Add to Cart" for your selected items
            </li>
            <li>When finished, click the "Proceed" button at the bottom</li>
          </ol>
        </div>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error fetching menu items.</p>}
        {menuItems && (
          <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-28">
              {menuItems.map((menuItem) => {
                const quantity = quantities[menuItem._id] || 0;
                return (
                  <li
                    key={menuItem._id}
                    className="bg-white shadow-md rounded-lg p-4 flex flex-col h-full"
                  >
                    <div className="h-48 mb-4 overflow-hidden rounded-lg">
                      <img
                        src={menuItem.image}
                        alt={menuItem.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-xl font-bold mb-2">{menuItem.name}</h2>
                    <p className="text-gray-600 mb-2 flex-grow">
                      {menuItem.description}
                    </p>
                    <div className="mt-auto">
                      <p className="text-gray-700 mb-2">
                        Price: ₹ {menuItem.price}
                      </p>
                      <p className="text-gray-700 mb-4">
                        Category: {menuItem.category}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Button
                            className="bg-gray-200 px-2 py-1 rounded-l"
                            onClick={() =>
                              handleQuantityChange(menuItem._id, quantity - 1)
                            }
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            min="0"
                            value={quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                menuItem._id,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-12 text-center border-t border-b"
                            readOnly
                          />
                          <Button
                            className="bg-gray-200 px-2 py-1 rounded-r"
                            onClick={() =>
                              handleQuantityChange(menuItem._id, quantity + 1)
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <Button
                        className={`w-full px-4 py-2 rounded ${getButtonClass(
                          quantity
                        )}`}
                        onClick={() => handleAddToCart(menuItem)}
                        disabled={quantity === 0}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md">
              <Button
                className="w-full bg-green-500 text-white hover:bg-green-600"
                onClick={handleProceed}
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuItems;
