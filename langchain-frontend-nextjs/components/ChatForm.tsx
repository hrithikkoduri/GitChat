import { useState } from 'react';

interface ChatFormProps {
    onSubmit: (message: string) => void;
}

export default function ChatForm({ onSubmit }: ChatFormProps) {
    const [chatMessage, setChatMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(chatMessage);
        setChatMessage(''); // Clear input after sending
    };

    return (
        <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 w-full p-4">
            <div className="container mx-auto max-w-screen-lg flex items-center space-x-2">
                <input
                    className="flex-grow border border-gray-300 rounded-3xl p-2 bg-black text-white"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button
                    className="px-4 py-2 bg-blue-500 text-white text-3xl rounded-3xl hover:bg-blue-600"
                    type="submit">
                    𖤂 {/* Arrow symbol */}
                </button>
            </div>
        </form>
    );
}
