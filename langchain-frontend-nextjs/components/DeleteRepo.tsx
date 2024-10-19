interface DeleteRepoProps {
    onDelete: () => void;
    message: string;
    loading: boolean;
}

export default function DeleteRepo({ onDelete, message, loading }: DeleteRepoProps) {
    if (!message) return null;

    return (
        <div className=" flex items-center justify-center max-auto px-25 mb-2 space-x-4 bottom-0 animate-fadeIn">
            <button
                onClick={onDelete}
                className={`px-4 py-2 text-white rounded ${loading ? 'bg-black' : 'bg-red-500 hover:bg-red-600'}`}
                disabled={loading}>
                {loading ? (
                    <div className="text-white text-center">
                        <div className="spinner"></div> 
                        <p>Deleting Repo...</p>
                    </div>
                ): 'Delete Repository'}
            </button>
        </div>
    );
}
