import { useParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Dashboard from "./Dashboard";
import AddProduct from "./AddProduct";
import ListProducts from "./ListProducts";
import AdminHeader from "../../components/admin/AdminHeader";
import OrderDetails from "./OrderDetails";
import Orders from "./Orders";

export default function AdminPage() {
    const { content } = useParams();
    const { orderId } = useParams();
    return (
        <div className="flex min-h-screen">
            {/* sidebar */}
            <div className="">
                <AdminSidebar />
            </div>
            {/* main */}
            <div className="w-full">
                {/* header */}
                <div className="w-full ">
                    <AdminHeader />
                </div>
                {/* content */}
                <div className="w-full p-3">
                    {content === "dashboard" && <Dashboard />}
                    {content === "add-product" && <AddProduct />}
                    {content === "list-products" && <ListProducts />}
                    {content === "orders" && <Orders />}
                    {content === "order-details" && orderId && <OrderDetails />}
                </div>
            </div>
        </div>
    );
}
