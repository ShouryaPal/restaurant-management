import { useEffect, useState } from "react";
import { Order, columns } from "../order/column";
import { DataTable } from "../order/DataTable";
import Navbar from "../customer/navbar";
import useUserStore from "../../hooks/user"; 
import { Navigate } from "react-router-dom";

export default function StaffHome() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrders, setNewOrders] = useState<Order[]>([]);
  const { user } = useUserStore();

  useEffect(() => {
    if (user?.isStaff) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/order/api/allorders`
      );
      const data = await response.json();
      setOrders(data);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      setNewOrders(
        data.filter((order: Order) => new Date(order.createdAt) > oneHourAgo)
      );
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/order/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (response.ok) {
        fetchOrders(); 
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (!user || !user.isStaff) {
    return <Navigate to="/staff/auth" replace />;
  }

  return (
    <div className="flex flex-col gap-4 mx-auto">
      <Navbar />
      <div className="container mx-auto px-4 mt-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">New Orders</h2>
          {newOrders.length > 0 ? (
            <ul className="space-y-2">
              {newOrders.map((order) => (
                <li key={order._id} className="bg-yellow-100 p-4 rounded-md">
                  <p>Table: {order.tableNumber}</p>
                  <p>Total: ₹{order.totalAmount}</p>
                  <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No new orders</p>
          )}
        </div>
        <h2 className="text-2xl font-bold mb-4">All Orders</h2>
        <DataTable
          columns={columns}
          data={orders}
          updateOrderStatus={updateOrderStatus}
        />
      </div>
    </div>
  );
}
