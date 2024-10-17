import {useState} from 'react';
import Header from '../components/Header';
import GitHubForm from '../components/GitHubForm';
import ResponseMessage from '../components/ResponseMessage';
import DeleteRepo from '../components/DeleteRepo';
import ChatForm from '../components/ChatForm';

export default function Home() {
    const [githubRepo, setGithubRepo] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [showInputs, setShowInputs] = useState(true);
    const [finalMessage, setFinalMessage] = useState('');
    const [deleteRepoMessage, setDeleteRepoMessage] = useState('');
    const [chatMessage, setChatMessage] = useState(''); 



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
    const handleChatSubmit = async (chatMessage: string) => {
        console.log("Chat message:", chatMessage);
        setChatMessage(''); // Clear input after sending
    };


    return (
        <div className="w-full min-h-screen bg-black">
            <div className="container mx-auto max-w-screen-sm px-10 py-8">
                <Header />
                <GitHubForm onSubmit={handleGitHubSubmit} loading={loading} showInputs={showInputs} />
                <ResponseMessage message={response} error={error} finalMessage={finalMessage} />
                <DeleteRepo onDelete={handleRemoveRepo} message={deleteRepoMessage} loading={loading} />
            </div>
            <ChatForm onSubmit={handleChatSubmit} />
        </div>
        
    )
}   