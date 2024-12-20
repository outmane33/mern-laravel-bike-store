import { useLocation, useNavigate } from "react-router-dom";
import { useOrderStore } from "../../store/useOrderStore";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Badge, Button, Table, TextInput } from "flowbite-react";
import { FiEye } from "react-icons/fi";
import { LuPencilLine } from "react-icons/lu";
import { FiTrash } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { IoCloseOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import moment from "moment";
import AdminOrderModal from "../../components/admin/AdminOrderModal";

export default function Orders() {
    const { orders, getAllOrders, deleteOrder } = useOrderStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isOpenDelete, setIsOpenDelete] = useState(false);

    useEffect(() => {
        getAllOrders();
    }, [location.pathname]);

    const DeleteModal = ({ isOpenDelete, onClose }) => {
        const handleDeleteOrder = async () => {
            deleteOrder(selectedOrder.id);
            onClose();
        };
        if (!isOpenDelete) return null;
        return (
            <>
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-[500px] relative py-10">
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 p-1 rounded-md hover:bg-gray-100 transition-colors z-10"
                        >
                            <FaTimes className="h-5 w-5" />
                        </button>

                        {/* Content */}
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-16 w-16 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Are you sure you want to delete this Order?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button
                                    color="failure"
                                    onClick={() => handleDeleteOrder()}
                                >
                                    {"Yes, I'm sure"}
                                </Button>
                                <Button
                                    color="gray"
                                    onClick={() => setIsOpenDelete(false)}
                                >
                                    No, cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="overflow-x-auto p-10">
            <p className="text-2xl font-bold pb-10">Products List</p>
            <div className="flex flex-col">
                {/* limit & search & add */}
                <div className="flex items-center justify-between">
                    {/* left */}
                    <div className="flex items-center gap-4 py-10">
                        <TextInput
                            placeholder="Search..."
                            rightIcon={IoIosSearch}
                            className="w-[400px]"
                        />
                    </div>
                    {/* right */}
                    <div>
                        <button className="bg-[#264c4f] text-white hover:bg-[#446a6d] flex-1 px-6 py-3 rounded-md transition-colors duration-200 mr-2 font-semibold text-base">
                            Export All Orders
                        </button>
                    </div>
                </div>
                {/* table */}
                <Table striped hoverable>
                    <Table.Head>
                        <Table.HeadCell>User</Table.HeadCell>
                        <Table.HeadCell>Order ID</Table.HeadCell>
                        <Table.HeadCell>Price</Table.HeadCell>
                        <Table.HeadCell>createdAt</Table.HeadCell>
                        <Table.HeadCell>updatedAt</Table.HeadCell>
                        <Table.HeadCell>Payment</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                        <Table.HeadCell>
                            <span className="sr-only">Edit</span>
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {orders &&
                            orders.map((order) => (
                                <Table.Row
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                    key={order.id}
                                >
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        <div className="flex gap-3 items-center">
                                            <FaRegUserCircle className="text-lg" />
                                            {order && order.user.username}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="font-semibold">
                                        {order.id}
                                    </Table.Cell>
                                    <Table.Cell className="font-semibold">
                                        ${order.total_order_price}.00
                                    </Table.Cell>
                                    <Table.Cell className="font-semibold">
                                        {moment(order.created_at).fromNow()}
                                    </Table.Cell>
                                    <Table.Cell className="font-semibold">
                                        {moment(order.updated_at).fromNow()}
                                    </Table.Cell>
                                    <Table.Cell className="font-semibold ">
                                        {order.is_paid ? (
                                            <FaCheck className="text-green-500" />
                                        ) : (
                                            ""
                                        )}
                                        {!order.is_paid && (
                                            <IoCloseOutline className="text-red-500" />
                                        )}
                                    </Table.Cell>
                                    <Table.Cell className="font-semibold">
                                        {order.status === "Pending" && (
                                            <Badge color="warning">
                                                Pending
                                            </Badge>
                                        )}
                                        {order.status === "In Process" && (
                                            <Badge color="gray">
                                                In Process
                                            </Badge>
                                        )}
                                        {order.status === "In Shipping" && (
                                            <Badge color="indigo">
                                                In Shipping
                                            </Badge>
                                        )}
                                        {order.status === "Delivered" && (
                                            <Badge color="success">
                                                Delivered
                                            </Badge>
                                        )}
                                        {order.status === "Rejected" && (
                                            <Badge color="failure">
                                                Rejected
                                            </Badge>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div className="flex gap-3 text-lg">
                                            <FiEye
                                                className="text-blue-500 cursor-pointer"
                                                onClick={() => {
                                                    navigate(
                                                        `/admin/order-details/${order.id}`
                                                    );
                                                }}
                                            />
                                            <LuPencilLine
                                                className="text-green-500 cursor-pointer"
                                                onClick={() => {
                                                    setIsOpen(true);
                                                    setSelectedOrder(order);
                                                }}
                                            />
                                            <FiTrash
                                                className="text-red-500 cursor-pointer"
                                                onClick={() => {
                                                    setIsOpenDelete(true);
                                                    setSelectedOrder(order);
                                                }}
                                            />
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                    </Table.Body>
                </Table>
                {/* pagination */}
                {/* <div className="flex overflow-x-auto sm:justify-center">
                        <Pagination
                            layout="pagination"
                            currentPage={
                                paginationResult.page ? paginationResult.page : 1
                            }
                            totalPages={
                                paginationResult.pages ? paginationResult.pages : 1
                            }
                            onPageChange={onPageChange}
                            previousLabel="Previous"
                            nextLabel="Next"
                            showIcons
                        />
                    </div> */}
            </div>

            <AdminOrderModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                selectedOrder={selectedOrder}
                // setOrders={setOrders}
            />

            {/* moadl Delete */}
            <div className="p-4">
                <DeleteModal
                    isOpenDelete={isOpenDelete}
                    onClose={() => setIsOpenDelete(false)}
                    title={"title"}
                />
            </div>
        </div>
    );
}
