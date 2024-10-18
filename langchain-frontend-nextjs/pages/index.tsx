import {useState} from 'react';
import Header from '../components/Header';
import GitHubForm from '../components/GitHubForm';
import ResponseMessage from '../components/ResponseMessage';
import DeleteRepo from '../components/DeleteRepo';
import ChatForm from '../components/ChatForm';
import ChatArea from '../components/ChatArea';

interface ChatMessage{
    sender: 'user' | 'bot';
    message: string;
}

export default function Home() {
    const [githubRepo, setGithubRepo] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [showInputs, setShowInputs] = useState(true);
    const [finalMessage, setFinalMessage] = useState('');
    const [deleteRepoMessage, setDeleteRepoMessage] = useState('');
    const [chatMessage, setChatMessage] = useState(''); 
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);



    const handleGitHubSubmit = async (githubRepo: string) => {
        setLoading(true);
        console.log("Github Repo: ", githubRepo)
        
        try{
            const res = await fetch('http://localhost:8000/load-repo/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({githubRepo}),
                
            });
            const data = await res.json();
            if(data.status === 'Success'){
                setResponse(`Successfully loaded files from ${githubRepo}`);
                setError(false);
                

                setTimeout(() => {
                    
                    setResponse(''); 
                    setFinalMessage(`All files stored in the database from <span class="underline">${githubRepo}</span>. Now let's chat!`);
                    
                    setTimeout(() => {
                        
                        setFinalMessage(''); 
                        setShowInputs(false);
                        setDeleteRepoMessage(`Do you want to delete the repository ${githubRepo} and add another GitHub repository?`);
                        
                        
                    }, 4000); 
                    
                }, 3000); 

            }
            else{
                setResponse(`Error loading files from ${githubRepo}`);
                setError(true);
            }

        }
        catch(err){
            console.error("Error fetching response", err);
        }
        finally{
            setLoading(false);
        }

    };

    const handleRemoveRepo = async () => {
        setLoading(true);

        try{
            const res = await fetch('http://localhost:8000/delete-repo/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({githubRepo}),
                
            });
            const data = await res.json();
            if(data.status === 'Success'){
                setDeleteRepoMessage('');
                setFinalMessage('');
                setGithubRepo('');
                setShowInputs(true);
                setResponse(`Successfully deleted files from ${githubRepo}`);
                setTimeout(() => {
                    setResponse('');
                    setError(false);
                }, 3000);
                
            }
            else{
                setResponse(`Error deleting files from ${githubRepo} }`);
                setTimeout(() => {
                    setResponse('');
                    setError(true);
                }, 3000);
            }
        }
        catch(err){
            console.error("Error fetching response", err);
        }
        finally{
            setLoading(false);
        }
    
    }
    const handleChatSubmit = async (message: string) => {
        console.log("Chat message:", message);
        setChatHistory([...chatHistory, {sender: 'user', message}]);
        setChatMessage(''); // Clear input after sending

         // Prepare the chat history to be sent to the backend
        const formattedChatHistory = chatHistory.map((chat) => ({
            sender: chat.sender,
            message: chat.message,
        }));

        try{
            const res = await fetch('http://localhost:8000/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                //body: JSON.stringify({question: message, chat_history: formattedChatHistory}),
                body: JSON.stringify({question: message}),
            });
            

            const data = await res.json();
            console.log("Response from chatbot", data.response);

            setChatHistory(prevHistory => [...prevHistory, {sender: 'bot', message: data.response}]);

        }
        catch(err){
            console.error("Error fetching response", err);
        }

    };


    return (
        <div className="w-full h-screen flex flex-col bg-black fixed">
=            <div className="container mx-auto max-w-screen-sm px-10 py-5">
                <Header />
                <GitHubForm onSubmit={handleGitHubSubmit} loading={loading} showInputs={showInputs} />
                <ResponseMessage message={response} error={error} finalMessage={finalMessage} />
                <DeleteRepo onDelete={handleRemoveRepo} message={deleteRepoMessage} loading={loading} />
            </div>

            {/* Main Chat Area */}
            <div className="flex-grow flex flex-col container mx-auto max-w-screen-xl px-4 py-5 overflow-hidden">
                <div className="flex-grow overflow-hidden">
                    <ChatArea chatHistory={chatHistory} />
                </div>
                {/* Chat Form - Always visible at the bottom */}
                <div className="mt-4 py-8">
                    <ChatForm onSubmit={handleChatSubmit} />
                </div>
            </div>
        </div>
        
    )
}   