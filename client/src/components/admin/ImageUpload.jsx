import { X } from "lucide-react";
import { FaPlus } from "react-icons/fa6";

export default function ImageUpload({ images, setImages }) {
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file && images.length < 3) {
            try {
                const base64 = await convertToBase64(file);
                setImages([...images, base64]);
            } catch (error) {
                console.error("Error converting image:", error);
            }
        }
    };
    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <div className="grid grid-cols-4 gap-4">
            {images.map((img, index) => (
                <div
                    key={index}
                    className="relative hover:border-2 hover:border-gray-500 border-2 rounded-xl transition-all duration-300"
                >
                    <img
                        src={img}
                        alt={`Upload ${index + 1}`}
                        className="w-24 h-24 rounded-xl object-cover"
                    />
                    <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                    >
                        <X size={16} className="text-white" />
                    </button>
                </div>
            ))}

            {images.length < 3 && (
                <label className="w-24 h-24 rounded-xl border-2 border-dashed flex justify-center items-center cursor-pointer">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                    <FaPlus className="text-2xl bg-[#9feda7] rounded-full text-white p-1 cursor-pointer" />
                </label>
            )}
        </div>
    );
}
