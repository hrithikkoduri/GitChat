import React, { useEffect, useRef } from 'react';
import { useState, useCallback } from 'react';
const SyntaxHighlighter = require('react-syntax-highlighter').PrismAsyncLight;
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';


interface ChatMessage {
    sender: 'user' | 'bot';
    message: string;
}

interface ChatAreaProps {
    chatHistory: ChatMessage[];
    isLoading: boolean;
    mode: boolean;
}

export default function ChatArea({ chatHistory , isLoading, mode}: ChatAreaProps) {
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory, isLoading]);

    const CopyButton = ({ text }: { text: string }) => {
        const [isCopied, setIsCopied] = useState(false);
    
        const copyToClipboard = useCallback(() => {
            navigator.clipboard.writeText(text).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }, [text]);
    
        return (
            <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded text-xs transition duration-150 ease-in-out"
            >
                {isCopied ? 'Copied!' : 'Copy'}
            </button>
        );
    };
    
    const CodeBlock = ({ language, code }: { language: string, code: string }) => {
        return (
            <div className="relative">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-t-lg font-mono text-sm">
                    {language.toUpperCase()}
                </div>
                <SyntaxHighlighter
                    language={language}
                    style={dracula}
                    showLineNumbers={true}
                    wrapLines={true}
                    customStyle={{
                        margin: 0,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                        borderBottomLeftRadius: '0.5rem',
                        borderBottomRightRadius: '0.5rem',
                    }}
                >
                    {code}
                </SyntaxHighlighter>
                <CopyButton text={code} />
            </div>
        );
    };
    
    const renderMessage = (message: string) => {
        const parts = message.split(/(```[\s\S]+?```|`[^`\n]+`|\*\*[^*\n]+\*\*|###[^\n]+)/g).map((part, index) => {
            if (part.startsWith('```') && part.endsWith('```')) {
                const code = part.slice(3, -3).trim();
                const languageMatch = code.match(/^[^\s\n]+/);
                const language = languageMatch ? languageMatch[0] : 'text';
                const codeContent = language ? code.slice(language.length).trim() : code;
                
                return (
                    <div key={index} className="text-sm ">
                        <CodeBlock language={language} code={codeContent} />
                    </div>
                );
            } else if (part.startsWith('`') && part.endsWith('`')) {
                const inlineCode = part.slice(1, -1);
                return (
                    <code key={index} className={`${mode? `bg-gray-800 text-white ` : `bg-gray-300 text-black ` } py-1 px-2 rounded font-mono text-xs`}>
                        {inlineCode}
                    </code>
                );
            } else if (part.startsWith('**') && part.endsWith('**')) {
                const boldText = part.slice(2, -2);
                return (
                    <strong key={index} className={`${mode ? `text-white`: `text-black`} font-extrabold text-lg `}>
                        {boldText}
                    </strong>
                );
            } else if (part.startsWith('###')) {
                const headingText = part.slice(3).trim();
                return (
                    <h3 key={index} className={`${mode ? `text-white`: `text-black`}text-2xl font-bold`}>
                        {headingText}
                    </h3>
                );
            } else {
                return part.split('\n').map((line, lineIndex) => (
                    <React.Fragment key={`${index}-${lineIndex}`}>
                        {line}
                        {lineIndex < part.split('\n').length - 1 && <br />}
                    </React.Fragment>
                ));
            }
        });
        return <>{parts}</>;
    };

    return (
        <div ref={chatContainerRef} className="h-full overflow-y-scroll text-lg p-4 rounded-lg flex flex-col-reverse font-inter">
            {isLoading && (
                <div className="chat-message  flex justify-start">
                    <div className={`${mode ?  'text-white' :'text-black'} flex items-center p-1 text-lg rounded bg-none`}>

                        <div className={`spinner mr-2 ${mode ? 'dark' : 'light'}`}></div>

                        <span>Generating Response...</span>
                    </div>
                </div>
            )}
            {chatHistory.slice().reverse().map((chat, index) => (
                <div key={index} className={`chat-message my-2 flex ${chat.sender === 'user' ? 'justify-end' : ' justify-center '}`}>
                    {chat.sender === 'user' ? (
                        <p 
                            className="p-2 bg-blue-500 text-white text-sm rounded-lg max-w-xs text break-words"
                            style={{ wordWrap: "break-word" }}
                        >
                            {chat.message}
                        </p>
                    ) : (
                        <div className="w-4/5">
                            <pre 
                                className={`${mode ?  `text-gray-400`: `text-gray-600`} p-2 rounded-lg  text-lg whitespace-pre-wrap overflow-x-auto font-inter text-justify`}
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
