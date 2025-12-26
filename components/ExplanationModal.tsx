'use client';

export default function ExplanationModal({
  open,
  onClose,
  content,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  content: string;
  loading: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="text-lg font-semibold mb-3">
          Transaction Explanation
        </h2>

        {loading ? (
          <p className="text-gray-500">AI is thinking… ⏳</p>
        ) : (
          <p className="text-gray-800 whitespace-pre-line">
            {content}
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-4 rounded bg-black px-4 py-2 text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
