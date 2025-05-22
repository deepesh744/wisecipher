export default function DeleteButton({ onClick }: { onClick: () => void }) {
    return (
      <button
        className="bg-red-500 text-white px-3 py-1 rounded"
        onClick={onClick}
        aria-label="Delete Document"
      >
        Delete
      </button>
    );
  }
  