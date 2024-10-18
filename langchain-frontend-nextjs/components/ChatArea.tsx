import React, { useEffect, useRef } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';

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

    const renderMessage = (message: string) => {
        const parts = message.split(/(```[^`]+```|`[^`]+`|\*\*[^*]+\*\*)/g).map((part, index) => {
            if (part.startsWith('```') && part.endsWith('```')) {
                const code = part.slice(3, -3);
                const language = code.split('\n')[0].trim(); // Get the first line as the language
                return (
                    <div key={index}>
                        <CopyBlock
                            text={code}
                            language={language}
                            showLineNumbers={true}
                            theme={dracula}
                        />
                    </div>
                );
            } else if (part.startsWith('`') && part.endsWith('`')) {
                const inlineCode = part.slice(1, -1);
                return (
                    <code key={index} className="text-white p-1 rounded">
                        {inlineCode}
                    </code>
                );
            } else if (part.startsWith('**') && part.endsWith('**')) {
                const boldText = part.slice(2, -2);
                return (
                    <strong key={index} className="text-white">
                        {boldText}
                    </strong>
                );
            } else {
                return part; // Return regular text
            }
        });
        return <>{parts}</>; // Return the array of parts
    };

    return (
        <div ref={chatContainerRef} className="h-full overflow-y-auto p-4 rounded-lg flex flex-col-reverse">
            {chatHistory.slice().reverse().map((chat, index) => (
                <div key={index} className={`chat-message my-2 flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {chat.sender === 'user' ? (
                        <p 
                            className="p-2 bg-blue-500 text-white rounded-lg max-w-xs text-right break-words"
                            style={{ wordWrap: "break-word" }}
                        >
                            {chat.message}
                        </p>
                    ) : (
                        <div className="w-4/5"> {/* Bot messages take 80% width */}
                            <pre 
                                className="p-2 text-white bg-gray-900 rounded-lg whitespace-pre-wrap overflow-x-auto"
                                style={{ 
                                    maxWidth: '100%',
                                    overflowWrap: 'break-word',
                                    wordWrap: 'break-word'
                                }}
                            >
                                {renderMessage(chat.message)}
                            </pre>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
