import { FiTrash } from "react-icons/fi";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";

export default function Cart() {
    const {
        cart,
        getUserCart,
        total_cart_price,
        updateCartItemQuantity,
        deleteProductFromCart,
    } = useCartStore();
    const { loading } = useAuthStore();
    const fetchCartData = async () => {
        getUserCart();
    };
    useEffect(() => {
        fetchCartData();
    }, [location.pathname]);

    const handleQuantity = async (id, quantity) => {
        updateCartItemQuantity({ product_id: id, quantity });
    };
    const handleIncrementQuantity = (id, quantity) => {
        if (!loading) handleQuantity(id, quantity + 1);
    };
    const handleDecrementQuantity = (id, quantity) => {
        if (!loading && quantity > 1) handleQuantity(id, quantity - 1);
    };
    const handleRemoveFromCart = async (id) => {
        deleteProductFromCart({ product_id: id });
    };
    return (
        <div className="flex flex-col gap-10 py-10 max-w-7xl mx-5 xl:mx-auto">
            <p className=" text-3xl lg:text-4xl font-bold">Cart</p>
            <div className="w-full flex flex-col lg:flex-row items-center ">
                {/* left */}
                <div className="flex-1">
                    <div className="max-w-3xl mx-auto p-4">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left text-lg py-4 font-medium text-gray-700">
                                        <p className="">Product</p>
                                    </th>
                                    <th className="text-left text-lg py-4 font-medium text-gray-700">
                                        <p className="hidden lg:block">
                                            Quantity
                                        </p>
                                    </th>
                                    <th className="text-right text-lg py-4 font-medium text-gray-700">
                                        <p className="hidden lg:block">
                                            Subtotal
                                        </p>
                                    </th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* First Product Row */}
                                {cart &&
                                    cart.map((item) => (
                                        <tr
                                            className="border-b "
                                            key={item.product_id}
                                        >
                                            <td className="py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-20 h-20 bg-gray-100 rounded">
                                                        <img
                                                            src={
                                                                item.image_cover
                                                            }
                                                            alt="Product"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-800">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-gray-600">
                                                            ${item.price}
                                                            .00
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                {/* quantity */}
                                                <div className="flex gap-2 w-fit px-2 items-center justify-center  border border-[#fecd06]  py-[7px] rounded-md">
                                                    <p
                                                        className="hover:bg-[#fecd06] rounded-md px-2 hover:text-white cursor-pointer transition-all duration-300"
                                                        onClick={() =>
                                                            handleIncrementQuantity(
                                                                item.product_id,
                                                                item.quantity
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </p>
                                                    <p className="text-gray-600 text-sm">
                                                        {item.quantity}
                                                    </p>
                                                    <p
                                                        className="hover:bg-[#fecd06] rounded-md px-2 hover:text-white cursor-pointer transition-all duration-300"
                                                        onClick={() =>
                                                            handleDecrementQuantity(
                                                                item.product_id,
                                                                item.quantity
                                                            )
                                                        }
                                                    >
                                                        -
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4 text-right font-medium text-gray-800">
                                                ${item.price * item.quantity}
                                                .00
                                            </td>
                                            <td className="py-4 pl-4">
                                                <button className="text-gray-400 hover:text-[#fecd06]">
                                                    <FiTrash
                                                        size={20}
                                                        onClick={() =>
                                                            handleRemoveFromCart(
                                                                item.product_id
                                                            )
                                                        }
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                        {/* Coupon Section */}
                        <div className="mt-6 lg:flex-row flex flex-col gap-2">
                            <input
                                type="text"
                                placeholder="Coupon code"
                                className="rounded-md lg:border-[3px] border-[1px] border-gray-100  px-6 lg:py-4 py-1 focus:outline-none focus:ring-0 focus:border-[#fecd06] lg:focus:border-[3px] focus:border-[1px] transition-colors duration-200"
                            />
                            <button className="bg-[#fecd06] whitespace-nowrap hover:bg-yellow-400 text-white px-6 py-1 lg:py-4 rounded-md transition-colors duration-500 mr-2 font-semibold text-sm lg:text-base">
                                Apply coupon
                            </button>
                        </div>
                    </div>
                </div>
                {/* right */}
                <div className="lg:flex-1/2 mx-10">
                    {/* Cart Totals */}
                    <div className="mt-8 max-w-md ml-auto">
                        <div className="bg-white rounded-3xl shadow-sm border px-16 py-6 flex flex-col gap-8 ">
                            <h2 className="text-base lg:text-lg font-bold lg:font-medium mb-4">
                                Cart totals
                            </h2>

                            <div className="flex justify-between items-center pb-3 ">
                                <span className="text-gray-800 lg:font-bold text-base">
                                    Subtotal
                                </span>
                                <span className="font-medium text-gray-600">
                                    ${total_cart_price}.00
                                </span>
                            </div>
                            <hr />
                            <div className="flex justify-between items-center pb-3">
                                <span className="text-gray-800 lg:font-bold text-base">
                                    Total
                                </span>
                                <span className="font-medium">
                                    ${total_cart_price}.00
                                </span>
                            </div>

                            <div className="py-3 text-base lg:text-base text-gray-600 whitespace-nowrap">
                                Congratulations! You got free shipping 🎉
                            </div>

                            <button className="bg-[#fecd06] whitespace-nowrap hover:bg-yellow-400 text-white px-6 py-4 rounded-md transition-all duration-500 mr-2 font-semibold text-base">
                                <Link to={"/checkout"} className="w-full">
                                    Proceed to checkout
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
