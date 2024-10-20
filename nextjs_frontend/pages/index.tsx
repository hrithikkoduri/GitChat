import {useState, useEffect} from 'react';
import Header from '../components/Header';
import GitHubForm from '../components/GitHubForm';
import ResponseMessage from '../components/ResponseMessage';
import DeleteRepo from '../components/DeleteRepo';
import ChatForm from '../components/ChatForm';
import ChatArea from '../components/ChatArea';
import ThemeToggle from '../components/ThemeToggle';



interface ChatMessage{
    sender: 'user' | 'bot';
    message: string;
}

export default function Home() {
    const [githubRepo, setGithubRepo] = useState('');
    const [response, setResponse] = useState('');
    const [initialLoading, setInitialLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);
    const [error, setError] = useState(false);
    const [showInputs, setShowInputs] = useState(false);
    const [finalMessage, setFinalMessage] = useState('');
    const [deleteRepoMessage, setDeleteRepoMessage] = useState('');
    const [chatMessage, setChatMessage] = useState(''); 
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [darkMode, setDarkMode] = useState(false);
    const [githubLoading, setGithubLoading] = useState(false);
    const [showRepoMessage, setShowRepoMessage] = useState(false); 
    const [serverAvailable, setServerAvailable] = useState(false);
    const [serverCheckLoading, setServerCheckLoading] = useState(true);

    useEffect(() => {
        const checkServerAvailability = async () => {
            try {
                const res = await fetch('http://localhost:8000/health/');
                if (res.ok) {
                    const data = await res.json();
                    setServerAvailable(data.status === 'healthy');
                } else {
                    setServerAvailable(false);
                }
            } catch (error) {
                console.error("Error checking server availability:", error);
                setServerAvailable(false);
            } finally {
                setServerCheckLoading(false);
            }
        };

        checkServerAvailability();
    }, []);
    
    
    useEffect(() => {
        const storedRepo = async () => {
            try{
                const res = await fetch('http://localhost:8000/get-repo-url/');
                const data = await res.json();
                if (data.url == 'Exist'){
                    setGithubRepo(data.repo_url);
                    console.log("Github Repo: ", data.repo_url);
                    setTimeout(() => {
                        setFinalMessage(`All files stored in the database from <span class="underline">${data.repo_url}</span>. Now let's chat!`);
                        setShowInputs(false);
                        setInitialLoading(false);

                        setTimeout(() => {
                            setFinalMessage('');
                            setDeleteRepoMessage(`Do you want to delete the repository ${data.repo_url} and add another GitHub repository?`);
                            setShowRepoMessage(true);
                        }, 2000);
                    }, 2000);
                    
                }
                else {
                    setShowInputs(true);
                }
            } catch(err){
                console.error("Error fetching response", err);
                setShowInputs(true);
        setShowInputs(true);
            } finally {
                setInitialLoading(false);
            }
        };
        storedRepo();
        
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };


    const handleGitHubSubmit = async (githubRepo: string) => {
        setGithubLoading(true);
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

                
                setGithubRepo(githubRepo);
                setTimeout(() => {
                    
                    setResponse(''); 
                    setFinalMessage(`All files stored in the database from <span class="underline">${githubRepo}</span>. Now let's chat!`);
                    
                    setTimeout(() => {
                        
                        setFinalMessage(''); 
                        setShowInputs(false);
                        setDeleteRepoMessage(`Do you want to delete the repository ${githubRepo} and add another GitHub repository?`);
                        setShowRepoMessage(true);
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
            setGithubLoading(false);
        }

    };

    const handleRemoveRepo = async () => {
        setDeleteLoading(true);

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
                setShowRepoMessage(false);
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
            setDeleteLoading(false);
        }
    
    }
    const handleChatSubmit = async (message: string) => {
        setChatLoading(true);
        console.log("Chat message:", message);
        setChatHistory([...chatHistory, {sender: 'user', message}]);
        setChatMessage(''); // Clear input after sending


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
        finally{
            setChatLoading(false);
        }
    };


    return (
        <div className={`${darkMode ? `bg-black` : `bg-white`} w-full h-screen flex flex-col`}>
            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            <div className="container mx-auto max-w-screen-sm px-5 mb-2">
                <Header mode={darkMode} />
                
                {serverCheckLoading ? (
                    <div className={`${darkMode ? 'text-white' : 'text-black'} text-center`}>
                        <div className={`spinner mr-2 ${darkMode ? 'dark' : 'light'}`}></div>
                        <p>Checking server status...</p>
                    </div>
                ) : serverAvailable ? (
                    <>
                        {initialLoading ? (
                            <div className={`${darkMode ? 'text-white' : 'text-black'} text-center`}>
                                <div className={`spinner mr-2 ${darkMode ? 'dark' : 'light'}`}></div>
                                <p>Setting up...</p>
                            </div>
                        ) : (
                            <>
                                {showRepoMessage && (
                                    <p className={`${darkMode ? 'text-white' : 'text-black'} text-center`}>
                                        Currently using repository: <span className={`${darkMode ? 'text-white' : 'text-black'} font-bold`}>{githubRepo}</span>
                                    </p>
                                )}
                                <GitHubForm onSubmit={handleGitHubSubmit} loading={githubLoading} showInputs={showInputs} mode={darkMode} />
                                <ResponseMessage message={response} error={error} finalMessage={finalMessage} />
                            </>
                        )}
                    </>
                ) : (
                    <div className={`${darkMode ? 'text-white' : 'text-black'} text-center`}>
                        <p>Server unavailable. Please try again later.</p>
                    </div>
                )}
            </div>

            {serverAvailable && (
                <>
                    <DeleteRepo onDelete={handleRemoveRepo} message={deleteRepoMessage} loading={deleteLoading} mode={darkMode} />
                    {githubRepo && (
                        <div className="flex-grow flex flex-col container mx-auto max-w-screen-xl px-4 overflow-hidden">
                            <div className="flex-grow overflow-hidden mb-12">
                                <ChatArea chatHistory={chatHistory} isLoading={chatLoading} mode={darkMode} />
                            </div>
                            <div className="mt-4 py-4">
                                <ChatForm onSubmit={handleChatSubmit} mode={darkMode} />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}   