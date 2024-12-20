import { useState } from "react";
import { X } from "lucide-react";
import { useProductStore } from "../../store/useProductStore";

export default function AddCategoryModal({ isOpen, onClose }) {
    const { addCategory } = useProductStore();
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addCategory(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Add Category</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Category Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                onChange={handleChange}
                                className="bg-[#eeeeee] py-3 rounded-xl px-4 w-full border-none"
                                placeholder="Weatherwear"
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                            >
                                Add Category
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
