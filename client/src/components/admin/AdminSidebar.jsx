import { Sidebar } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiArrowSmRight, HiChartPie } from "react-icons/hi";
import { GiJigsawBox } from "react-icons/gi";
import { FaBasketShopping } from "react-icons/fa6";
import { AiFillThunderbolt } from "react-icons/ai";
import { useAuthStore } from "../../store/useAuthStore";

export default function AdminSidebar() {
    const { logout } = useAuthStore();
    const handleLogout = async () => {
        logout();
    };

    return (
        <Sidebar className="hidden md:block">
            <Sidebar.Logo>
                <div className="flex items-center text-2xl text-black italic font-semibold">
                    <AiFillThunderbolt />
                    <p className="font-semibold">Bike</p>
                </div>
            </Sidebar.Logo>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item as={"div"} icon={HiChartPie} label="outmane">
                        <Link to="/admin/dashboard">Dashboard</Link>
                    </Sidebar.Item>
                    <Sidebar.Collapse icon={FaBasketShopping} label="Products">
                        <Sidebar.Item as={"div"}>
                            <Link to="/admin/add-product">Add Product</Link>
                        </Sidebar.Item>
                        <Sidebar.Item as={"div"}>
                            <Link to="/admin/list-products">Product List</Link>
                        </Sidebar.Item>
                    </Sidebar.Collapse>
                    <Sidebar.Collapse icon={GiJigsawBox} label="Orders">
                        <Sidebar.Item as={"div"}>
                            <Link to="/admin/orders">Order List</Link>
                        </Sidebar.Item>
                    </Sidebar.Collapse>

                    <Sidebar.Item
                        as={"div"}
                        icon={HiArrowSmRight}
                        onClick={handleLogout}
                        className="cursor-pointer"
                    >
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}
