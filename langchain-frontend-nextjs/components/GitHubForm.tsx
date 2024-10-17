import React, { useState } from 'react';

interface GitHubFormProps {
    onSubmit: (githubRepo: string) => void;
    loading: boolean;
    showInputs: boolean;
}

export default function GitHubForm({ onSubmit, loading, showInputs }: GitHubFormProps) {
    const [githubRepo, setGithubRepo] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(githubRepo);
    };

    if (!showInputs) return null;

    return (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
                className="flex-grow border border-gray-100 rounded-3xl p-2 bg-black text-white"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                placeholder="Enter the link of the github repository"
            />
            <button
                className={`px-4 py-2 text-white text-xl rounded-3xl ${loading ? 'bg-gray-800' : 'bg-blue-500 hover:bg-blue-600'}`}
                type="submit"
                disabled={loading}>
                {loading ? 'Loading...' : 'Submit'}
            </button>
        </form>
    );
}
