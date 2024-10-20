import React, { useState } from 'react';

interface GitHubFormProps {
    onSubmit: (githubRepo: string) => void;
    loading: boolean;
    showInputs: boolean;
    mode: boolean;
}

export default function GitHubForm({ onSubmit, loading, showInputs, mode }: GitHubFormProps) {
    const [githubRepo, setGithubRepo] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(githubRepo);
    };

    if (!showInputs) return null;

    return (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
                //className="flex-grow border border-gray-100 rounded-3xl p-2 bg-black text-white"
                className={`flex-grow border border-gray-300 rounded-3xl p-2 ${mode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}

                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                placeholder="Enter the link of the github repository"
            />
            <button
                className={`px-4 py-2 text-white text-lg rounded-3xl ${loading ? (mode? 'bg-black' : `bg-white` )  : 'bg-blue-500 hover:bg-blue-600'}`}
                type="submit"
                disabled={loading}>
                {loading ? (
                    <div className="chat-message flex top-0 right-0 justify-start">
                    <div className={`${mode ?  'text-white' :'text-black'} flex items-center p-1 text-sm rounded bg-none`}>
                    <div className={`spinner mr-2 ${mode ? 'dark' : 'light'}`}></div>
                        <span>Loading Github Repo...</span>
                    </div>
                </div>
                ): 'Submit'}
            </button>
        </form>
    );
}
