export default function ColorSelector({
    colors,
    selectedColors,
    setSelectedColors,
}) {
    const handleColorClick = (colorId) => {
        setSelectedColors((prev) => {
            if (prev.includes(colorId)) {
                return prev.filter((id) => id !== colorId);
            } else {
                return [...prev, colorId];
            }
        });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-12">
                {colors &&
                    colors.map((color) => (
                        <div
                            key={color.id}
                            onClick={() => handleColorClick(color.id)}
                            className={`
                w-10 h-10 rounded-md cursor-pointer
                border-2 transition-all duration-200
                ${
                    selectedColors.includes(color.id)
                        ? "border-blue-500 scale-110"
                        : "border-gray-200"
                }
              `}
                            style={{
                                backgroundColor: color.name.toLowerCase(),
                                // Special case for white to make it visible
                                boxShadow:
                                    color.name.toLowerCase() === "white"
                                        ? "0 0 0 1px rgba(0,0,0,0.1)"
                                        : "none",
                            }}
                        />
                    ))}
            </div>

            <div className="text-sm text-gray-600">
                Selected colors:{" "}
                {selectedColors.length > 0
                    ? colors
                          .filter((c) => selectedColors.includes(c.id))
                          .map((c) => c.name)
                          .join(", ")
                    : "None"}
            </div>
        </div>
    );
}
