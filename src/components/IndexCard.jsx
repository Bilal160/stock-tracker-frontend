
export default function IndexCard({
  index,
  isSelected,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-colors ${
        isSelected
          ? "bg-blue-500 text-white"
          : "bg-white hover:bg-gray-50 border border-gray-200"
      }`}
    >
      <h3 className="font-medium">{index.name}</h3>
      <p className="text-sm opacity-80">{index.symbol}</p>
    </button>
  );
}
