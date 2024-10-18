import React, { useEffect, useRef } from 'react';

interface ChatMessage {
    sender: 'user' | 'bot';
    message: string;
}

interface ChatAreaProps {
    chatHistory: ChatMessage[];
}

export default function ChatArea({ chatHistory }: ChatAreaProps) {
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

 

    return (
        <div ref={chatContainerRef} className="h-full overflow-y-auto p-4 rounded-lg flex flex-col-reverse">
            {chatHistory.slice().reverse().map((chat, index) => (
                <div key={index} className={`chat-message my-2 flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {chat.sender === 'user' ? (
                        <p 
                            className="p-2 bg-blue-500 text-white rounded-lg max-w-xs bottom text-right break-words"
                            style={{ wordWrap: "break-word" }}
                        >
                            {chat.message}
                        </p>
                    ) : (
                        <div className="w-4/5"> {/* Bot messages take 80% width */}
                            <pre 
                                className="p-2 text-white bg-gray-800 rounded-lg whitespace-pre-wrap overflow-x-auto"
                                style={{ 
                                    maxWidth: '100%',
                                    overflowWrap: 'break-word',
                                    wordWrap: 'break-word'
                                }}
                            >
                                {chat.message}
                            </pre>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
