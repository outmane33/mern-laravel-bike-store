import { GoArrowUpRight } from "react-icons/go";
import ProductCard from "../components/shared/ProductCard";
import { IoSearch } from "react-icons/io5";
import { Breadcrumb, TextInput, Drawer } from "flowbite-react";
import { useEffect, useState } from "react";
import { TbColorFilter } from "react-icons/tb";
import TopSellingProductCard from "../components/shared/TopSellingProductCard";
import { useProductStore } from "../store/useProductStore";

export default function Shop() {
    const { products, getAllProducts, getDataColors, dataColors } =
        useProductStore();

    // State for filters
    const [formQuery, setFormQuery] = useState({
        sort: "",
        category: "",
        colors: [],
    });
    const [keyword, setKeyword] = useState("");
    const [checkedCategory, setCheckedCategory] = useState({});
    const [selectedColors, setSelectedColors] = useState({});
    const [numOfPages, setNumOfPages] = useState(1);
    const [colorCounts, setColorCounts] = useState({});
    const [pagination, setPagination] = useState({});

    const [count, setCount] = useState(0);
    const [isOpenFilter, setIsOpenFilter] = useState(false);

    // Fetch products on component mount
    useEffect(() => {
        getAllProducts(`/api/products`);
        getDataColors();
    }, []);

    // Update filters and trigger API call
    const applyFilters = () => {
        const query = new URLSearchParams();

        if (keyword) query.append("title", keyword);

        const selectedCategories = Object.keys(checkedCategory).filter(
            (key) => checkedCategory[key]
        );
        if (selectedCategories.length > 0) {
            query.append("category", selectedCategories.join(","));
        }

        const selectedColorsArray = Object.keys(selectedColors).filter(
            (key) => selectedColors[key]
        );
        if (selectedColorsArray.length > 0) {
            selectedColorsArray.forEach((color) =>
                query.append("colors[]", color)
            );
        }

        // Apply sort if necessary
        if (formQuery.sort) {
            query.append("sort_by", formQuery.sort);
            query.append("sort_direction", "asc"); // Change if needed
        }

        getAllProducts(`/api/products?${query.toString()}`);
    };
    // Handle changes for keyword search
    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleKeywordSubmit = (e) => {
        e.preventDefault();
        applyFilters();
    };

    // Handle changes for category filter
    const handleCategoryChange = (e) => {
        const { name, checked } = e.target;
        setCheckedCategory((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    // Handle changes for color filter
    const handleColorChange = (color) => {
        setSelectedColors((prev) => ({
            ...prev,
            [color]: !prev[color],
        }));
    };

    // Utility function to build the query string
    const buildQueryString = (params) => {
        const { sort, colors, category, keyword, page } = params;
        const queryParts = [];

        if (sort) queryParts.push(`sort=${sort}`);
        if (category) queryParts.push(`category[in]=${category}`);
        if (colors) queryParts.push(`colors[in]=${colors}`);
        if (keyword) queryParts.push(`keyword=${keyword}`);
        if (page) queryParts.push(`page=${page}`);

        return `/api/v1/product${
            queryParts.length ? "?" + queryParts.join("&") : ""
        }`;
    };

    // Update filters whenever state changes
    useEffect(() => {
        applyFilters();
    }, [checkedCategory, selectedColors, formQuery.sort]);

    const handleNextPage = () => {
        if (pagination.page < numOfPages) {
            const updatedFormQuery = {
                ...formQuery,
                page: (pagination.page || 1) + 1,
            };

            const queryString = buildQueryString({
                ...updatedFormQuery,
                keyword,
            });

            setFormQuery(updatedFormQuery);
            getAllProducts(queryString);
        }
    };
    const handlePreviousPage = () => {
        if (pagination.page > 1) {
            const updatedFormQuery = {
                ...formQuery,
                page: (pagination.page || 1) - 1,
            };

            const queryString = buildQueryString({
                ...updatedFormQuery,
                keyword,
            });

            setFormQuery(updatedFormQuery);
            getAllProducts(queryString);
        }
    };
    const handleSpecificPage = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= numOfPages) {
            const updatedFormQuery = {
                ...formQuery,
                page: pageNumber,
            };

            const queryString = buildQueryString({
                ...updatedFormQuery,
                keyword,
            });

            setFormQuery(updatedFormQuery);
            getAllProducts(queryString);
        }
    };

    // Handle sorting change
    const sortChange = (e) => {
        const selectedOption = e.target.value;
        setFormQuery((prevQuery) => ({
            ...prevQuery,
            sort: selectedOption,
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const queryString = buildQueryString({
            ...formQuery,
            keyword,
        });
        getAllProducts(queryString);
    };

    const handleClose = () => setIsOpenFilter(false);
    return (
        <div>
            {/* banner section */}
            <div className="w-full bg-black relative">
                {/* Overlay */}
                <div
                    className="absolute banner inset-0 opacity-45 z-10"
                    style={{
                        backgroundImage:
                            "url('https://startersites.io/blocksy/e-bike/wp-content/uploads/2024/05/background-pattern-2.svg')",
                    }}
                ></div>

                {/* Main content */}
                <div className="relative z-20 flex flex-row lg:flex-row max-w-7xl h-[300px] mx-10 xl:mx-auto md:mx-10 lg:mx-auto lg:px-10">
                    <div className="flex-1 flex flex-col justify-between gap-2 py-5 ">
                        <div></div>
                        <div>
                            <Breadcrumb aria-label="Default breadcrumb example">
                                <Breadcrumb.Item>
                                    <p className="text-yellow-300 text-xs lg:text-sm">
                                        HOME
                                    </p>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <p className="text-gray-400 text-xs lg:text-sm">
                                        SHOP
                                    </p>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                            <p className="uppercase pt-3 text-4xl lg:text-6xl font-semibold leading-snug text-white">
                                SHOP
                            </p>
                        </div>
                    </div>
                    {/* right */}
                    <div className="flex-1 flex justify-center"></div>
                </div>
            </div>
            {/* content */}
            <div className="flex lg:flex-row max-w-7xl py-10  mx-10 xl:mx-auto md:mx-10 lg:mx-auto lg:px-10">
                {/* left */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* result & sort */}
                    <div className="flex justify-between w-full">
                        <p className="text-sm flex items-center gap-2">
                            SHOWING 1–
                            {numOfPages} OF {count} RESULTS
                        </p>
                        <select
                            className="h-[40px] border border-gray-300 text-gray-500 text-sm"
                            onChange={sortChange}
                            value={formQuery.sort} // Bind value to formQuery.sort
                        >
                            <option value="">Default Sorting</option>
                            <option value="Sort by Latest">
                                Sort by Latest
                            </option>
                            <option value="Sort by Price Low to High">
                                Sort by Price Low to High
                            </option>
                            <option value="Sort by Price High to Low">
                                Sort by Price High to Low
                            </option>
                        </select>
                    </div>
                    <button
                        className="border rounded-2 flex w-fit rounded-md items-center gap-2 px-4 py-1 hover:bg-[#fecd06] hover:text-black transition-all duration-300 lg:hidden"
                        onClick={() => setIsOpenFilter(true)}
                    >
                        <TbColorFilter /> FILTER
                    </button>
                    {/* products */}
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10 w-full">
                        {/*product card  */}
                        {products &&
                            products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                    </div>
                    {/* pagination */}
                    <div className="w-full  flex justify-between items-center">
                        {/* prev */}
                        <div>
                            {pagination.prev ? (
                                <button
                                    className="border-2 border-gray-400 uppercase rounded-md flex items-center gap-2 px-6 py-2 text-xs hover:bg-white hover:text-[#fecd06] hover:border-[#fecd06]  transition-all duration-300"
                                    onClick={handlePreviousPage}
                                >
                                    {"Previous"}
                                </button>
                            ) : (
                                ""
                            )}
                        </div>
                        {/* pages */}
                        <div className="flex gap-2">
                            {Array.from(
                                { length: pagination.pages },
                                (_, index) => (
                                    <button
                                        key={index}
                                        className={`border-2 border-white rounded-md flex items-center gap-2 px-4 py-2 hover:bg-white hover:text-[#fecd06] hover:border-[#fecd06]  transition-all duration-300 ${
                                            index + 1 === pagination.page
                                                ? "!bg-[#fecd06] !text-white"
                                                : "bg-white text-black"
                                        } `}
                                        onClick={() =>
                                            handleSpecificPage(index + 1)
                                        }
                                    >
                                        {index + 1}
                                    </button>
                                )
                            )}
                        </div>
                        {/* next */}
                        <div>
                            {pagination.next ? (
                                <button
                                    className="border-2 border-gray-400 uppercase rounded-md flex items-center gap-2 px-6 py-2 text-xs hover:bg-white hover:text-[#fecd06] hover:border-[#fecd06]  transition-all duration-300"
                                    onClick={handleNextPage}
                                >
                                    {"Next"}
                                </button>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </div>
                {/* right */}
                {/* Filter Sidebar */}
                <div className="w-[300px] p-10 flex-col gap-3 hidden lg:flex">
                    {/* Keyword Search */}
                    <form onSubmit={handleKeywordSubmit}>
                        <TextInput
                            id="keyword"
                            rightIcon={IoSearch}
                            className="mb-7 text-3xl"
                            placeholder="Search"
                            value={keyword}
                            onChange={handleKeywordChange}
                        />
                    </form>

                    {/* Filter by Color */}
                    <div>
                        <p className="text-xl font-semibold text-[#212b28]">
                            Filter by color
                        </p>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        {dataColors.map(({ color, product_count }) => (
                            <div
                                key={color}
                                className={`flex items-center justify-between gap-2 rounded p-1 cursor-pointer group w-full`}
                                onClick={() => handleColorChange(color)}
                            >
                                <div
                                    className={`w-4 h-4 rounded-full bg-[${color.toLowerCase()}] outline-offset-2 group-hover:outline group-hover:outline-4 p-1 group-hover:outline-[${color.toLowerCase()}] transition-all duration-200`}
                                    style={{
                                        backgroundColor: color.toLowerCase(),
                                    }} // Dynamically set the background color
                                ></div>
                                <span className="text-gray-700">{color}</span>
                                <span
                                    className={`text-gray-500 border px-2 rounded-full ml-auto transition-all duration-200 ${
                                        selectedColors[color]
                                            ? "bg-[#fecd06] text-white border-[#fecd06]"
                                            : ""
                                    }`}
                                >
                                    {product_count}{" "}
                                    {/* Display the product count for each color */}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Filter by Category */}
                    <div className="my-5">
                        <p className="text-xl font-semibold text-[#212b28]">
                            Filter by category
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 pb-6">
                        {["City Bikes", "Mountain Bikes", "Road Bikes"].map(
                            (category) => (
                                <div key={category}>
                                    <input
                                        id={`checkbox-${category}`}
                                        type="checkbox"
                                        name={category}
                                        className="rounded mr-2 border-[#bfc5c3]"
                                        checked={
                                            checkedCategory[category] || false
                                        }
                                        onChange={handleCategoryChange}
                                    />
                                    <label
                                        className="text-gray-700"
                                        htmlFor={`checkbox-${category}`}
                                    >
                                        {category}
                                    </label>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
            {/* Quetions section */}
            <div
                className="w-full relative"
                style={{
                    backgroundImage:
                        "url('https://startersites.io/blocksy/e-bike/wp-content/uploads/2024/04/shop-contact-section-image.webp')",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 py-10 max-w-7xl  pt-20 pb-28 mx-10 gap-72 xl:mx-auto md:mx-10 lg:mx-auto lg:px-10 ">
                    <div className="bg-[#fecd06] py-[80px] px-[60px] max-w-[450px]  h-full  flex flex-col justify-center gap-10">
                        <div className="flex flex-col gap-2">
                            <p className="text-black text-4xl font-semibold whitespace-nowrap">
                                Have Questions?
                            </p>
                            <p className="text-black text-2xl font-semibold whitespace-nowrap">
                                Feel Free to Contact Us!
                            </p>
                        </div>
                        <p className="text-base text-black">
                            Donec ultrices tincidunt arcu non sodales. Orci eu
                            lobortis elementum nibh tellus molestie nunc. Fames
                            ac turpis egestas maecenas pharetra convallis
                            posuere morbi.
                        </p>
                        <button className="flex items-center self-start bg-black text-white gap-2 px-6 py-4 rounded-md font-semibold">
                            Contact Info
                            <GoArrowUpRight className="text-xl font-semibold" />
                        </button>
                    </div>
                    <div className="hidden lg:block"></div>
                </div>
            </div>
            <Drawer
                open={isOpenFilter}
                onClose={handleClose}
                position="right"
                className="w-[440px]"
            >
                <Drawer.Header
                    title="Available Filters"
                    titleIcon={() => <></>}
                />
                <Drawer.Items>
                    {/* filter sidebar */}
                    <div className=" px-5 pt-5  flex-col gap-3">
                        <form onSubmit={handleSubmit}>
                            <TextInput
                                id="keyword"
                                rightIcon={IoSearch}
                                className="mb-7 text-3xl"
                                placeholder="Search"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </form>

                        {/* filter by color */}
                        <div className="">
                            <p className="text-xl font-semibold text-[#212b28] ">
                                Filter by color
                            </p>
                        </div>
                        {/* colors */}
                        <div className="w-full flex flex-col gap-2">
                            {/* Beige */}
                            <div
                                className={`flex items-center justify-between gap-2 rounded p-1 cursor-pointer group w-full ${
                                    selectedColors.Beige ? "bg-gray-100" : ""
                                }`}
                                onClick={() => handleColorChange("Beige")}
                            >
                                <div className="w-4 h-4 rounded-full bg-[#D2B48C] outline-offset-2 group-hover:outline group-hover:outline-4 p-1 group-hover:outline-[#D2B48C] transition-all duration-200"></div>
                                <span className="text-gray-700">Beige</span>
                                <span
                                    className={`text-gray-500 border px-2 rounded-full ml-auto transition-all duration-200 ${
                                        selectedColors.Beige
                                            ? "bg-[#446a6d] text-white border-[#446a6d]"
                                            : ""
                                    }`}
                                >
                                    {colorCounts.Beige}
                                </span>
                            </div>

                            {/* Blue */}
                            <div
                                className={`flex items-center justify-between gap-2 rounded p-1 cursor-pointer group w-full ${
                                    selectedColors.Blue ? "bg-gray-100" : ""
                                }`}
                                onClick={() => handleColorChange("Blue")}
                            >
                                <div className="w-4 h-4 rounded-full bg-[#0790ba] outline-offset-2 group-hover:outline group-hover:outline-4 p-1 group-hover:outline-[#0790ba] transition-all duration-200"></div>
                                <span className="text-gray-700">Blue</span>
                                <span
                                    className={`text-gray-500 border px-2 rounded-full ml-auto transition-all duration-200 ${
                                        selectedColors.Blue
                                            ? "bg-[#446a6d] text-white border-[#446a6d]"
                                            : ""
                                    }`}
                                >
                                    {colorCounts.Blue}
                                </span>
                            </div>
                            {/* Gray */}
                            <div
                                className={`flex items-center justify-between gap-2 rounded p-1 cursor-pointer group w-full ${
                                    selectedColors.Gray ? "bg-gray-100" : ""
                                }`}
                                onClick={() => handleColorChange("Gray")}
                            >
                                <div className="w-4 h-4 rounded-full bg-[#c8c9c9] outline-offset-2 group-hover:outline group-hover:outline-4 p-1 group-hover:outline-[#c8c9c9] transition-all duration-200"></div>
                                <span className="text-gray-700">Gray</span>
                                <span
                                    className={`text-gray-500 border px-2 rounded-full ml-auto transition-all duration-200 ${
                                        selectedColors.Gray
                                            ? "bg-[#446a6d] text-white border-[#446a6d]"
                                            : ""
                                    }`}
                                >
                                    {colorCounts.Gray}
                                </span>
                            </div>
                            {/* Green */}
                            <div
                                className={`flex items-center justify-between gap-2 rounded p-1 cursor-pointer group w-full ${
                                    selectedColors.Green ? "bg-gray-100" : ""
                                }`}
                                onClick={() => handleColorChange("Green")}
                            >
                                <div className="w-4 h-4 rounded-full bg-[#6fa802] outline-offset-2 group-hover:outline group-hover:outline-4 p-1 group-hover:outline-[#6fa802] transition-all duration-200"></div>
                                <span className="text-gray-700">Green</span>
                                <span
                                    className={`text-gray-500 border px-2 rounded-full ml-auto transition-all duration-200 ${
                                        selectedColors.Green
                                            ? "bg-[#446a6d] text-white border-[#446a6d]"
                                            : ""
                                    }`}
                                >
                                    {colorCounts.Green}
                                </span>
                            </div>
                            {/* Orange */}
                            <div
                                className={`flex items-center justify-between gap-2 rounded p-1 cursor-pointer group w-full ${
                                    selectedColors.Orange ? "bg-gray-100" : ""
                                }`}
                                onClick={() => handleColorChange("Orange")}
                            >
                                <div className="w-4 h-4 rounded-full bg-[#ff8412] outline-offset-2 group-hover:outline group-hover:outline-4 p-1 group-hover:outline-[#ff8412] transition-all duration-200"></div>
                                <span className="text-gray-700">Orange</span>
                                <span
                                    className={`text-gray-500 border px-2 rounded-full ml-auto transition-all duration-200 ${
                                        selectedColors.Orange
                                            ? "bg-[#446a6d] text-white border-[#446a6d]"
                                            : ""
                                    }`}
                                >
                                    {colorCounts.Orange}
                                </span>
                            </div>

                            {/* White */}
                            <div
                                className={`flex items-center justify-between gap-2 rounded p-1 cursor-pointer group w-full ${
                                    selectedColors.White ? "bg-gray-100" : ""
                                }`}
                                onClick={() => handleColorChange("White")}
                            >
                                <div className="w-4 h-4 rounded-full bg-[#f4f4f4] outline-offset-2 group-hover:outline group-hover:outline-4 p-1 group-hover:outline-[#f4f4f4] transition-all duration-200"></div>
                                <span className="text-gray-700">White</span>
                                <span
                                    className={`text-gray-500 border px-2 rounded-full ml-auto transition-all duration-200 ${
                                        selectedColors.White
                                            ? "bg-[#446a6d] text-white border-[#446a6d]"
                                            : ""
                                    }`}
                                >
                                    {colorCounts.White}
                                </span>
                            </div>

                            {/* Yellow */}
                            <div
                                className={`flex items-center justify-between gap-2 rounded p-1 cursor-pointer group w-full ${
                                    selectedColors.Yellow ? "bg-gray-100" : ""
                                }`}
                                onClick={() => handleColorChange("Yellow")}
                            >
                                <div className="w-4 h-4 rounded-full bg-[#f9cd0c] outline-offset-2 group-hover:outline group-hover:outline-4 p-1 group-hover:outline-[#f9cd0c] transition-all duration-200"></div>
                                <span className="text-gray-700">Yellow</span>
                                <span
                                    className={`text-gray-500 border px-2 rounded-full ml-auto transition-all duration-200 ${
                                        selectedColors.Yellow
                                            ? "bg-[#446a6d] text-white border-[#446a6d]"
                                            : ""
                                    }`}
                                >
                                    {colorCounts.Yellow}
                                </span>
                            </div>
                        </div>

                        {/* filter by category */}
                        <div className="my-5">
                            <p className="text-xl font-semibold text-[#212b28] ">
                                Filter by category
                            </p>
                        </div>
                        {/* categories */}
                        <div className="flex flex-col gap-2 pb-6">
                            <div>
                                <input
                                    id="checkbox-City-Bikes"
                                    type="checkbox"
                                    name="City Bikes"
                                    className="rounded mr-2 border-[#bfc5c3]"
                                    checked={checkedCategory.City_Bikes}
                                    onChange={handleCategoryChange}
                                />
                                <label
                                    className="text-gray-700"
                                    htmlFor="checkbox-City-Bikes"
                                >
                                    City Bikes
                                </label>
                            </div>

                            <div>
                                <input
                                    id="checkbox-Mountain-Bikes"
                                    type="checkbox"
                                    name="Mountain Bikes"
                                    className="rounded mr-2 border-[#bfc5c3]"
                                    checked={checkedCategory.Mountain_Bikes}
                                    onChange={handleCategoryChange}
                                />
                                <label
                                    className="text-gray-700"
                                    htmlFor="checkbox-Mountain-Bikes"
                                >
                                    Mountain Bikes
                                </label>
                            </div>

                            <div>
                                <input
                                    id="checkbox-Road-Bikes"
                                    type="checkbox"
                                    name="Road Bikes"
                                    className="rounded mr-2 border-[#bfc5c3]"
                                    checked={checkedCategory.Road_Bikes}
                                    onChange={handleCategoryChange}
                                />
                                <label
                                    className="text-gray-700"
                                    htmlFor="checkbox-Road-Bikes"
                                >
                                    Road Bikes
                                </label>
                            </div>
                        </div>

                        {/* best selling products */}
                        <div className="flex flex-col gap-2 mt-5 ">
                            <p className="text-xl font-semibold text-[#212b28] mb-3">
                                Best selling products
                            </p>
                            <div className="flex flex-col gap-4">
                                {/* product */}
                                <TopSellingProductCard
                                    img="https://startersites.io/blocksy/e-bike/wp-content/uploads/2024/04/product-image-2.webp"
                                    title="Posuere Morbi"
                                    price="550"
                                />
                                <TopSellingProductCard
                                    img="https://startersites.io/blocksy/e-bike/wp-content/uploads/2024/04/product-image-1.webp"
                                    title="Accumsan Nulla"
                                    price="400"
                                />
                                <TopSellingProductCard
                                    img="https://startersites.io/blocksy/e-bike/wp-content/uploads/2024/04/product-image-3.webp"
                                    title="Tellus Pellentesque"
                                    price="350"
                                />
                                <TopSellingProductCard
                                    img="https://startersites.io/blocksy/e-bike/wp-content/uploads/2024/04/product-image-4.webp"
                                    title="Sagittis Purus"
                                    price="450"
                                />
                            </div>
                        </div>
                    </div>
                </Drawer.Items>
            </Drawer>
        </div>
    );
}
