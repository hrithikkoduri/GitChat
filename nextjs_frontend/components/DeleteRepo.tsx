interface DeleteRepoProps {
    onDelete: () => void;
    message: string;
    loading: boolean;
    mode: boolean;
}

export default function DeleteRepo({ onDelete, message, loading, mode }: DeleteRepoProps) {
    if (!message) return null;

    return (
        <div className=" flex items-center justify-center absolute top-10 right-10 z-5 animate-fadeIn">
            <button
                onClick={onDelete}
                className={`px-4 py-2 text-white rounded ${loading ? (mode? 'bg-black' : `bg-white` ) : 'bg-red-500 hover:bg-red-600'}`}
                disabled={loading}>
                {loading ? (
                    <div className="chat-message flex top-0 right-0 justify-start">
                    <div className={`${mode ?  'text-white' :'text-black'} flex items-center p-1 text-sm rounded bg-none`}>
                    <div className={`spinner mr-2 ${mode ? 'dark' : 'light'}`}></div>
                        <span>Deleting Repo...</span>
                    </div>
                </div>
                ): 'Delete Repository'}
            </button>
        </div>
    );
}
