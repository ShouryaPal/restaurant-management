import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import useCartStore from "../../../hooks/useCartStore";
import useUserStore from "../../../hooks/user";
import Navbar from "../navbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";

const Checkout = () => {
  const {
    items,
    tableNumber,
    updateQuantity,
    removeItem,
    setTableNumber,
    getTotalAmount,
    clearCart,
  } = useCartStore();

  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      toast.error("Your cart is empty. Redirecting to menu...", {
        duration: 3000,
        onAutoClose: () => navigate("/customer/menu"),
      });
    }
  }, [items, navigate]);

  const handleConfirmOrder = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty. Redirecting to menu...", {
        duration: 3000,
        onAutoClose: () => navigate("/customer/menu"),
      });
      return;
    }

    if (!tableNumber) {
      toast.error("Please select a table number");
      return;
    }

    if (!user || !user.email) {
      toast.error("Please sign in to place an order");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/order/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tableNumber,
            items,
            totalAmount: getTotalAmount(),
            email: user.email,
          }),
        }
      );

      if (response.ok) {
        toast.success("Order placed successfully!", {
          duration: 3000,
          onAutoClose: () => {
            clearCart();
            navigate("/customer/home");
          },
        });
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    } else {
      removeItem(itemId);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">Please sign in to access the checkout.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return null; // This will prevent the component from rendering while redirecting
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Toaster />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="mb-4">
          <p className="text-lg mb-2">Email: {user.email}</p>
        </div>
        <div className="mb-4">
          <label htmlFor="tableNumber" className="block mb-2">
            Table Number:
          </label>
          <Input
            type="number"
            id="tableNumber"
            value={tableNumber || ""}
            onChange={(e) => setTableNumber(parseInt(e.target.value))}
            className="w-24"
            min="1"
          />
        </div>
        <ul className="mb-6">
          {items.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center mb-2 p-2 border rounded"
            >
              <span className="font-semibold">{item.name}</span>
              <div className="flex items-center">
                <span className="mr-2">₹{item.price.toFixed(2)}</span>
                <div className="flex items-center border rounded">
                  <Button
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity - 1)
                    }
                    className="px-2 py-1"
                    variant="ghost"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item._id, parseInt(e.target.value))
                    }
                    className="w-12 text-center border-x"
                    min="0"
                  />
                  <Button
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity + 1)
                    }
                    className="px-2 py-1"
                    variant="ghost"
                  >
                    +
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="text-xl font-bold mb-4">
          Total: ₹{getTotalAmount().toFixed(2)}
        </div>
        <Button onClick={handleConfirmOrder} className="w-full">
          Confirm Order
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
