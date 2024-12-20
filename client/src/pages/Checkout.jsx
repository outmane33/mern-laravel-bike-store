import { useEffect, useState } from "react";
import { FiTrash } from "react-icons/fi";
import { Alert, Label } from "flowbite-react";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useOrderStore } from "../store/useOrderStore";

export default function Checkout() {
    const {
        cart,
        getUserCart,
        total_cart_price,
        updateCartItemQuantity,
        deleteProductFromCart,
    } = useCartStore();
    const { loading } = useAuthStore();
    const [error, setError] = useState();
    const [formAdresses, setFormAdresses] = useState({});
    const { cashOrder, cartOrder, loading: orderLoading } = useOrderStore();

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

    const handleCheckoutByStrip = async () => {
        if (
            !formAdresses.city ||
            !formAdresses.details ||
            !formAdresses.phone ||
            !formAdresses.postal_code
        ) {
            setError("All fields are required");
            return;
        }
        await cartOrder(formAdresses);
    };

    const handleCheckoutByCash = async () => {
        if (
            !formAdresses.city ||
            !formAdresses.details ||
            !formAdresses.phone ||
            !formAdresses.postal_code
        ) {
            setError("All fields are required");
            return;
        }
        await cashOrder(formAdresses);
    };

    const handleChange = (e) => {
        setFormAdresses({ ...formAdresses, [e.target.id]: e.target.value });
    };

    return (
        <>
            <div className="flex flex-col gap-10 max-w-7xl mx-auto py-28">
                <p className="text-4xl font-bold mx-5">Checkout</p>
                {error && (
                    <Alert className="text-lg text-white font-semibold bg-[#e44b5f]">
                        {error}
                    </Alert>
                )}
                {/* main content */}
                <div className=" flex flex-col lg:flex-row gap-10 mx-5 md:mx-7 lg:mx-9 xl:mx-12">
                    {/* left */}
                    <div className="flex-1">
                        <form className="flex flex-col gap-5">
                            <p className="lg:text-xl text-lg font-bold">
                                Billing details
                            </p>
                            {/* name and last name */}
                            <div className="flex md:flex-row flex-col gap-5 w-full ">
                                {/* name */}
                                <div className="flex flex-col flex-1">
                                    <Label
                                        htmlFor="default-search"
                                        className="text-[#989d91] lg:text-lg text-base"
                                    >
                                        Your Name *
                                    </Label>
                                    <input
                                        type="text"
                                        className="rounded-md border-[3px] border-gray-100 w-full p-3 focus:outline-none focus:ring-0 focus:border-[#fecd06] focus:border-[3px] transition-colors duration-200"
                                    />
                                </div>
                                {/* last name */}
                                <div className="flex flex-col flex-1">
                                    <Label
                                        className="text-[#989d91] lg:text-lg text-base"
                                        htmlFor="default-search"
                                    >
                                        Your Last Name *
                                    </Label>
                                    <input
                                        type="text"
                                        className="rounded-md border-[3px] border-gray-100 w-full p-3 focus:outline-none focus:ring-0 focus:border-[#fecd06] focus:border-[3px] transition-colors duration-200"
                                    />
                                </div>
                            </div>
                            {/* Street */}
                            <div className="flex flex-col">
                                <Label
                                    className="text-[#989d91] lg:text-lg text-base"
                                    htmlFor="default-search"
                                >
                                    Street address *
                                </Label>
                                <input
                                    type="text"
                                    id="details"
                                    onChange={handleChange}
                                    className="rounded-md  border-[3px] border-gray-100 w-full p-3 focus:outline-none focus:ring-0 focus:border-[#fecd06] focus:border-[3px] transition-colors duration-200"
                                />
                            </div>
                            {/* Phone * */}
                            <div className="flex flex-col">
                                <Label
                                    className="text-[#989d91] lg:text-lg text-base"
                                    htmlFor="default-search"
                                >
                                    Phone *
                                </Label>
                                <input
                                    type="text"
                                    id="phone"
                                    onChange={handleChange}
                                    className="rounded-md  border-[3px] border-gray-100 w-full p-3 focus:outline-none focus:ring-0 focus:border-[#fecd06] focus:border-[3px] transition-colors duration-200"
                                />
                            </div>
                            {/* Town / City * */}
                            <div className="flex flex-col">
                                <Label
                                    className="text-[#989d91] lg:text-lg text-base"
                                    htmlFor="default-search"
                                >
                                    Town / City *
                                </Label>
                                <input
                                    type="text"
                                    id="city"
                                    onChange={handleChange}
                                    className="rounded-md  border-[3px] border-gray-100 w-full p-3 focus:outline-none focus:ring-0 focus:border-[#fecd06] focus:border-[3px] transition-colors duration-200"
                                />
                            </div>
                            {/* ZIP Code * */}
                            <div className="flex flex-col">
                                <Label
                                    className="text-[#989d91] lg:text-lg text-base"
                                    htmlFor="default-search"
                                >
                                    ZIP Code *
                                </Label>
                                <input
                                    type="text"
                                    id="postal_code"
                                    onChange={handleChange}
                                    className="rounded-md  border-[3px] border-gray-100 w-full p-3 focus:outline-none focus:ring-0 focus:border-[#fecd06] focus:border-[3px] transition-colors duration-200"
                                />
                            </div>
                            {/* Additional information */}
                            <div className="flex flex-col">
                                <Label
                                    className="text-[#989d91] lg:text-lg text-base"
                                    htmlFor="default-search"
                                >
                                    Additional information
                                </Label>

                                <textarea
                                    className="w-full  border-[3px] border-gray-100 rounded-2xl p-3 focus:outline-none focus:ring-0 focus:border-[#fecd06] focus:border-[3px] transition-colors duration-200 resize-none"
                                    rows={4}
                                />
                            </div>
                        </form>
                    </div>
                    {/* right */}
                    <div className="flex-1 flex gap-10 flex-col  ">
                        <p className="lg:text-xl text-lg font-bold">
                            Your order
                        </p>
                        {/* subtotal title */}
                        <div className="flex justify-between px-5">
                            <p className="font-semibold">Product</p>
                            <p className="font-semibold">Subtotal</p>
                        </div>
                        <hr />
                        {cart &&
                            cart.map((item) => (
                                <div key={item.product_id}>
                                    {/* products */}
                                    <div className=" border-b-[1px] pb-6 border-gray-100">
                                        <div className="flex items-center gap-10 px-5">
                                            {/* image */}
                                            <img
                                                src={item.image_cover}
                                                alt=""
                                                className="w-[110px] h-[110px]"
                                            />
                                            {/* content */}
                                            <div className="flex flex-col gap-2 flex-1">
                                                <p className="text-base">
                                                    {item.title}
                                                </p>
                                                <div className="flex items-center gap-8">
                                                    {/* quantity */}
                                                    <div className="flex gap-2 border border-[#fecd06] px-3 py-[8px] rounded-md">
                                                        <p
                                                            className="hover:bg-[#fecd06]  rounded-md px-2 hover:text-white cursor-pointer transition-all duration-300"
                                                            onClick={() =>
                                                                handleIncrementQuantity(
                                                                    item.product_id,
                                                                    item.quantity
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </p>
                                                        <p className="text-gray-600">
                                                            {item.quantity}
                                                        </p>
                                                        <p
                                                            className="hover:bg-[#fecd06]  rounded-md px-2 hover:text-white cursor-pointer transition-all duration-300"
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
                                                    <p>
                                                        $
                                                        {item.price *
                                                            item.quantity}
                                                        .00
                                                    </p>
                                                </div>
                                            </div>
                                            {/* remove */}
                                            <div>
                                                <FiTrash
                                                    className="text-lg cursor-pointer hover:text-[#fecd06] transition-all duration-300"
                                                    onClick={() =>
                                                        handleRemoveFromCart(
                                                            item.product_id
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        {/* subtotal  */}
                        <div className="flex justify-between px-5 border-b-[1px] pb-6 border-gray-100">
                            <p className="font-semibold">Subtotal</p>
                            <p className="font-semibold">
                                ${total_cart_price}.00
                            </p>
                        </div>
                        {/* total */}
                        <div className="flex justify-between px-5">
                            <p className="font-semibold">Total</p>
                            <p className="font-semibold">
                                ${total_cart_price}.00
                            </p>
                        </div>
                        {/* congrats */}
                        <div className="px-5 text-lg text-gray-600 whitespace-nowrap">
                            Congratulations! You got free shipping 🎉
                        </div>
                        <div className="w-full h-[2px] bg-[#fecd06] px-24"></div>
                        <p className="text-base">
                            Your personal data will be used to process your
                            order, support your experience throughout this
                            website, and for other purposes described in our{" "}
                            <span className="underline">privacy policy.</span>
                        </p>
                        <div className="w-full  flex">
                            <button
                                className="bg-[#fecd06] whitespace-nowrap flex-1 hover:bg-yellow-400 text-white px-6 py-4 rounded-md transition-colors duration-200 mr-2 font-semibold text-base"
                                onClick={handleCheckoutByStrip}
                            >
                                {orderLoading ? "Loading..." : "Stripe"}
                            </button>
                            <button
                                className="bg-[#fecd06] whitespace-nowrap flex-1 hover:bg-yellow-400 text-white px-6 py-4 rounded-md transition-colors duration-200 mr-2 font-semibold text-base"
                                onClick={handleCheckoutByCash}
                            >
                                Cash on delivery
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
