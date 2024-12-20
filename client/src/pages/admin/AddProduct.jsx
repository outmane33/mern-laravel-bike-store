import { FaShoppingBag } from "react-icons/fa";
import { RiDraftLine } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { useProductStore } from "../../store/useProductStore";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import AddCategoryModal from "../../components/admin/AddCategoryModal ";
import ColorSelector from "../../components/admin/ColorSelector";
import AddColorModal from "../../components/admin/AddColorModal";
import ImageUpload from "../../components/admin/ImageUpload";
export default function AddProduct() {
    const [formData, setFormData] = useState({
        sold: 11,
        ratings_average: 0,
        ratings_quantity: 0,
        sku: "NA/NA",
    });
    const [selectedColors, setSelectedColors] = useState([]);
    const [images, setImages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenColor, setIsModalOpenColor] = useState(false);
    const ref = useRef(null);
    const { getAllCategories, categories, addProduct, getAllColors, colors } =
        useProductStore();
    const location = useLocation();
    useEffect(() => {
        getAllCategories();
        getAllColors();
    }, [location.pathname]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result;
                setFormData({ ...formData, image_cover: base64String });
            };
            reader.readAsDataURL(file);
        }
    };
    const handleChage = (e) => {
        const value = e.target.value;
        const id = e.target.id;

        // Convert numeric fields to numbers
        if (["price", "quantity", "price_after_discount"].includes(id)) {
            setFormData({ ...formData, [id]: Number(value) });
        } else {
            setFormData({ ...formData, [id]: value });
        }
    };

    const handleCategoryChange = (value) => {
        setFormData({ ...formData, category_id: Number(value) });
    };
    const handleAddProduct = async (e) => {
        e.preventDefault();

        try {
            if (!formData.category_id) {
                alert("Please select a category");
                return;
            }

            const dataToSend = {
                ...formData,
                price: Number(formData.price),
                quantity: Number(formData.quantity),
                price_after_discount:
                    Number(formData.price_after_discount) || 0,
                category_id: Number(formData.category_id),
                brand_id: Number(formData.brand_id),
                ratings_average: Number(formData.ratings_average),
                ratings_quantity: Number(formData.ratings_quantity),
                sold: Number(formData.sold),
                colors: selectedColors,
                images: images,
            };

            await addProduct(dataToSend);
        } catch (error) {
            console.error("Full error:", error);
            console.error("Error response:", error.response?.data);
            alert(
                `Failed to add product: ${
                    error.response?.data?.message || error.message
                }`
            );
        }
    };
    return (
        <div className="w-full h-full b flex flex-col gap-6 p-6">
            <div className="flex justify-between">
                {/* left */}
                <div className="flex items-center gap-2 font-semibold">
                    <FaShoppingBag />
                    <p>Add New Product</p>
                </div>
                {/* roight */}
                <div className="flex items-center gap-4">
                    <div className="border-2 flex items-center gap-4 px-4 py-2 rounded-full">
                        <RiDraftLine className="text-lg" />
                        <p className="font-semibold">Save Draft</p>
                    </div>
                    <div
                        className="border-2 flex items-center gap-4 px-4 py-2 rounded-full bg-[#9feda8] cursor-pointer"
                        onClick={handleAddProduct}
                    >
                        <FaCheck className="text-lg" />
                        <p className="font-semibold ">Add Product</p>
                    </div>
                </div>
            </div>
            {/* details */}
            <div className="flex gap-6">
                {/* left */}
                <div className="flex-1 flex flex-col gap-4 bg-[#f9f9f9] p-6 rounded-2xl">
                    <p className="font-semibold text-lg">General information</p>
                    <div className="flex flex-col">
                        <label className="font-semibold">Name Product</label>
                        <input
                            className="bg-[#eeeeee] py-3 rounded-xl px-4"
                            placeholder="Name Product"
                            id="title"
                            onChange={handleChage}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">
                            Small Description Product
                        </label>
                        <textarea
                            className="bg-[#eeeeee] py-3 rounded-xl px-4 border-none"
                            placeholder="Write Description Product"
                            rows={4}
                            id="small_description"
                            onChange={handleChage}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">
                            Long Description Product
                        </label>
                        <textarea
                            className="bg-[#eeeeee] py-3 rounded-xl px-4 border-none"
                            placeholder="Write Description Product"
                            rows={4}
                            id="long_description"
                            onChange={handleChage}
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <label className="font-semibold">Color</label>
                            <label className="Pick Available Brand text-sm text-gray-500">
                                Pick Available Color
                            </label>
                        </div>
                        <ColorSelector
                            colors={colors}
                            selectedColors={selectedColors}
                            setSelectedColors={setSelectedColors}
                        />
                    </div>
                </div>
                {/* right */}
                <div className="w-[450px] bg-[#f9f9f9] p-6 rounded-2xl flex flex-col gap-10 justify-center items-center">
                    <div className="w-full rounded-xl flex flex-col gap-2">
                        <p className="font-semibold text-lg">Upload Img</p>
                        <input
                            type="file"
                            className="hidden"
                            ref={ref}
                            onChange={handleFileChange}
                        />
                        <div
                            onClick={() => ref.current.click()}
                            className="cursor-pointer"
                        >
                            {formData.image_cover ? (
                                <img
                                    src={formData.image_cover}
                                    alt=""
                                    className="rounded-xl"
                                />
                            ) : (
                                <div className="w-full h-[400px] rounded-xl border-2 border-dashed flex justify-center items-center">
                                    <FaPlus className="text-4xl bg-[#9feda7] rounded-full text-white p-1 cursor-pointer" />
                                </div>
                            )}
                        </div>
                    </div>
                    <ImageUpload images={images} setImages={setImages} />
                </div>
            </div>
            {/* second */}
            <div className="flex gap-6">
                {/* left */}
                <div className="flex-1 flex flex-col gap-4 bg-[#f9f9f9] p-6 rounded-2xl">
                    <p className="font-semibold text-lg">Pricing And Stock</p>
                    <div className="w-full flex gap-4">
                        <div className="flex flex-col flex-1">
                            <label className="font-semibold">
                                Base Pricing
                            </label>
                            <input
                                className="bg-[#eeeeee] py-3 rounded-xl px-4"
                                placeholder="0"
                                id="price"
                                onChange={handleChage}
                            />
                        </div>
                        <div className="flex flex-col flex-1">
                            <label className="font-semibold">Stock</label>
                            <input
                                className="bg-[#eeeeee] py-3 rounded-xl px-4"
                                placeholder="0"
                                id="quantity"
                                onChange={handleChage}
                            />
                        </div>
                    </div>
                    <div className="w-full flex gap-4">
                        <div className="flex flex-col flex-1">
                            <label className="font-semibold">Discount</label>
                            <input
                                className="bg-[#eeeeee] py-3 rounded-xl px-4"
                                placeholder="10%"
                                id="price_after_discount"
                                onChange={handleChage}
                            />
                        </div>
                        <div className="flex flex-col flex-1">
                            <label className="font-semibold">
                                Discount Type
                            </label>
                            <select className="bg-[#eeeeee] py-3 rounded-xl px-4 border-none">
                                <option>Fixed</option>
                                <option>Percentage</option>
                            </select>
                        </div>
                    </div>
                </div>
                {/* right */}
                <div className="w-[450px] bg-[#f9f9f9] p-6 rounded-2xl flex flex-col gap-10">
                    <p className="font-semibold text-lg">Category</p>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">
                            Product Category
                        </label>
                        <select
                            className="bg-[#eeeeee] py-3 rounded-xl px-4 border-none"
                            id="category_id"
                            onChange={(event) =>
                                handleCategoryChange(event.target.value)
                            }
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/*  */}
                    <div
                        className="border-2 flex items-center gap-4 px-4 py-2 rounded-full bg-[#9feda8] cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <FaCheck className="text-lg" />
                        <p className="font-semibold">Add Category</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-6">
                <div className="flex-1"></div>
                <div className="w-[450px] bg-[#f9f9f9] p-6 rounded-2xl flex flex-col gap-10">
                    <p className="font-semibold text-lg">Color</p>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Product Color</label>
                        <div
                            className="border-2 flex items-center gap-4 px-4 py-2 rounded-full bg-[#9feda8] cursor-pointer"
                            onClick={() => setIsModalOpenColor(true)}
                        >
                            <FaCheck className="text-lg" />
                            <p className="font-semibold">Add Color</p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <AddCategoryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
            <div>
                <AddColorModal
                    isOpen={isModalOpenColor}
                    onClose={() => setIsModalOpenColor(false)}
                />
            </div>
        </div>
    );
}
