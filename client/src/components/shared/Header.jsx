import { Avatar, Drawer, Dropdown, Navbar } from "flowbite-react";
import { useEffect, useState } from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { RiShoppingBag4Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import { FiTrash } from "react-icons/fi";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import LoginModal from "./LoginModal";
import { useAuthStore } from "../../store/useAuthStore";
import { useCartStore } from "../../store/useCartStore";
import { useWishlistStore } from "../../store/useWishlistStore";

export default function Header() {
    const { user, logout, loading } = useAuthStore();
    const {
        cart,
        getUserCart,
        updateCartItemQuantity,
        deleteProductFromCart,
        total_cart_price,
    } = useCartStore();
    const { wishlist, userWishlist } = useWishlistStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenLogin, setIsOpenLogin] = useState(false);
    const [isOpenToggle, setIsOpenToggle] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleClose = () => setIsOpen(false);
    const handleMobileClose = () => setIsOpenToggle(false);
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

    const handleLogout = async () => {
        logout();
    };

    useEffect(() => {
        const getUserWishlist = async () => {
            userWishlist();
        };
        getUserWishlist();
    }, [location.pathname]);

    return (
        <>
            <Navbar className="bg-black">
                <div className="flex items-center text-2xl text-white italic font-semibold">
                    <AiFillThunderbolt />
                    <p className="font-semibold">Bike</p>
                </div>
                <Navbar.Collapse className="hidden md:flex ">
                    <Navbar.Link href="/">
                        <span className="text-white hover:text-[#fecd06] w-[70px] py-5 block text-center uppercase font-semibold hover:border-b hover:border-yellow-400 transition-all duration-300 border-b border-transparent">
                            Home
                        </span>
                    </Navbar.Link>
                    <Navbar.Link
                        className="text-white hover:text-[#fecd06]"
                        href="/shop"
                    >
                        <span className="text-white hover:text-[#fecd06] w-[70px] py-5 block text-center uppercase font-semibold hover:border-b hover:border-yellow-400 transition-all duration-300">
                            Shop
                        </span>
                    </Navbar.Link>
                    <Navbar.Link
                        className="text-white hover:text-[#fecd06]"
                        href="/about"
                    >
                        <span className="text-white hover:text-[#fecd06] w-[70px] py-5 block text-center uppercase font-semibold hover:border-b hover:border-yellow-400 transition-all duration-300">
                            About
                        </span>
                    </Navbar.Link>
                    <Navbar.Link
                        className="text-white hover:text-[#fecd06]"
                        href="/blog"
                    >
                        <span className="text-white hover:text-[#fecd06] w-[70px] py-5 block text-center uppercase font-semibold hover:border-b hover:border-yellow-400 transition-all duration-300">
                            Blog
                        </span>
                    </Navbar.Link>
                    <Navbar.Link
                        className="text-white hover:text-[#fecd06]"
                        href="/contact"
                    >
                        <span className="text-white hover:text-[#fecd06] w-[70px] py-5 block text-center uppercase font-semibold hover:border-b hover:border-yellow-400 transition-all duration-300">
                            Contact
                        </span>
                    </Navbar.Link>
                </Navbar.Collapse>
                <div className="gap-4 text-lg hidden md:flex">
                    {/* user */}
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar
                                alt="User settings"
                                img={FaRegCircleUser}
                                rounded
                                size="xss"
                                className="text-white hover:text-[#fecd06] hidden md:block"
                                onClick={() => setIsOpenLogin(true)}
                            />
                        }
                    >
                        {user ? (
                            <>
                                <Dropdown.Header>
                                    <p className="font-semibold text-sm">
                                        {user.username
                                            ? `Logged in as ${user.username}`
                                            : ""}
                                    </p>
                                </Dropdown.Header>
                                <Dropdown.Item
                                    className="flex gap-2 cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    <MdLogout className="text-lg" />
                                    Logout
                                </Dropdown.Item>
                            </>
                        ) : (
                            ""
                        )}
                    </Dropdown>
                    {/* wishlist */}
                    <button
                        className=" py-2 px-2 rounded-lg "
                        disabled={loading}
                        onClick={() => {
                            navigate("/wishlist");
                        }}
                    >
                        <Link to="/shop/wishlist" className="relative ">
                            <FaRegHeart className="text-lg hover:text-[#fecd06] text-white" />
                            <span
                                className={`absolute top-[-5px] right-[-10px] text-xs bg-[#fecd06] text-black font-semibold rounded-full w-4 h-4 flex items-center justify-center ${
                                    wishlist.length <= 0 && "hidden"
                                }`}
                            >
                                {wishlist.length}
                            </span>
                        </Link>
                    </button>
                    {/* cart */}
                    <button
                        className=" py-2 px-2 rounded-lg "
                        disabled={loading}
                    >
                        <Link className="relative">
                            <RiShoppingBag4Line
                                className="text-xl hover:text-[#fecd06] text-white"
                                onClick={() => setIsOpen(true)}
                            />
                            <span
                                className={`absolute top-[-5px] right-[-10px] text-xs bg-[#fecd06] text-black font-semibold rounded-full w-4 h-4 flex items-center justify-center ${
                                    cart.length <= 0 && "hidden"
                                }`}
                            >
                                {cart.length}
                            </span>
                        </Link>
                    </button>
                </div>
                <Navbar.Toggle onClick={() => setIsOpenToggle(!isOpenToggle)} />
            </Navbar>
            {/* cart drawer */}
            <Drawer
                className="w-[400px] md:w-[500px] "
                open={isOpen}
                onClose={handleClose}
                position="right"
            >
                <Drawer.Header title="Shopping Cart" titleIcon={() => <></>} />
                <Drawer.Items className="h-full">
                    <div className="flex flex-col justify-between h-modal">
                        <div className="flex flex-1 flex-col gap-6">
                            {cart &&
                                cart.map((item) => (
                                    <div
                                        key={item.product_id}
                                        className="flex items-center gap-10 px-5"
                                    >
                                        {/* image */}
                                        <img
                                            src={item.image_cover}
                                            alt=""
                                            className="w-20 h-20"
                                        />
                                        {/* content */}
                                        <div className="flex flex-col gap-2 flex-1">
                                            <p className="font-semibold text-lg cursor-pointer hover:text-[#fecd06]">
                                                {item.title}
                                            </p>
                                            <div className="flex items-center gap-8">
                                                {/* quantity */}
                                                <div className="flex gap-2 border border-[#fecd06] px-2 py-[6px] rounded-md">
                                                    <p
                                                        className="hover:bg-[#fecd06] flex items-center justify-center rounded-md px-2 hover:text-white cursor-pointer transition-all duration-300"
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
                                                        className="hover:bg-[#fecd06] rounded-md flex items-center justify-center px-2 hover:text-white cursor-pointer transition-all duration-300"
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
                                                <p>${item.price}.00</p>
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
                                ))}
                        </div>
                        <div className="">
                            <hr />
                            <div className="flex w-full justify-between py-5">
                                <p className="text-sm text-[#264c4f] font-semibold">
                                    SUBTOTAL:
                                </p>
                                <p className="text-sm text-[#264c4f] font-semibold">
                                    {total_cart_price} MAD
                                </p>
                            </div>

                            <div className="flex">
                                <button
                                    className="bg-[#fecd06] flex-1 hover:bg-yellow-400 text-black px-6 py-4 rounded-md transition-colors duration-200 mr-2 font-semibold text-base"
                                    onClick={() => {
                                        navigate("/cart");
                                        setIsOpen(false);
                                    }}
                                >
                                    View Cart
                                </button>
                                <button
                                    className="bg-[#fecd06] flex-1 hover:bg-yellow-400 text-black px-6 py-4 rounded-md transition-colors duration-200 mr-2 font-semibold text-base"
                                    onClick={() => {
                                        navigate("/checkout");
                                        setIsOpen(false);
                                    }}
                                >
                                    Checout
                                </button>
                            </div>
                        </div>
                    </div>
                </Drawer.Items>
            </Drawer>
            {/* mobile drawer */}
            <Drawer
                open={isOpenToggle}
                onClose={handleMobileClose}
                position="right"
                className="w-full bg-[#12151a]"
            >
                <Drawer.Header />
                <Drawer.Items>
                    <div className="w-full min-h-screen flex flex-col gap-20 items-center justify-center">
                        <div className="flex items-center text-4xl text-white">
                            <AiFillThunderbolt />
                            <p className="font-semibold ">Bike</p>
                        </div>
                        <div className="text-white flex flex-col items-center gap-4 text-xl font-bold">
                            <Link className="hover:text-[#f0b641]" to={"/"}>
                                Home
                            </Link>
                            <Link className="hover:text-[#f0b641]" to={"/shop"}>
                                Shop
                            </Link>
                            <Link
                                className="hover:text-[#f0b641]"
                                to={"/about"}
                            >
                                About
                            </Link>
                            <Link className="hover:text-[#f0b641]" to={"/blog"}>
                                Blog
                            </Link>
                            <Link
                                className="hover:text-[#f0b641]"
                                to={"/contact"}
                            >
                                Contact
                            </Link>
                        </div>
                        <div className="text-white flex gap-6 text-lg">
                            <FaFacebook />
                            <FaSquareXTwitter />
                            <AiFillInstagram className="text-xl" />
                        </div>
                    </div>
                </Drawer.Items>
            </Drawer>
            {/* Login moadl */}
            {!user && (
                <LoginModal
                    isOpenLogin={isOpenLogin}
                    onClose={() => setIsOpenLogin(false)}
                    title={"title"}
                />
            )}
        </>
    );
}
