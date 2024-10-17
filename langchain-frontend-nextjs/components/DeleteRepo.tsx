interface DeleteRepoProps {
    onDelete: () => void;
    message: string;
    loading: boolean;
}

export default function DeleteRepo({ onDelete, message, loading }: DeleteRepoProps) {
    if (!message) return null;

    return (
        <div className="container flex items-center justify-center max-auto px-25 py-5 space-x-4 animate-fadeIn">
            <button
                onClick={onDelete}
                className={`px-4 py-2 text-white rounded ${loading ? 'bg-gray-800' : 'bg-red-500 hover:bg-red-600'}`}
                disabled={loading}>
                {loading ? 'Deleting...' : 'Delete Repository'}
            </button>
        </div>
    );
}
