import {useState} from 'react';
import githubLogo from '../logo.png';


export default function Home() {
    const [githubRepo, setGithubRepo] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [showInputs, setShowInputs] = useState(true);
    const [finalMessage, setFinalMessage] = useState('');
    const [deleteRepoMessage, setDeleteRepoMessage] = useState('');
    const [chatMessage, setChatMessage] = useState(''); 



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
    const handleChatSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Chat message:", chatMessage);
        setChatMessage(''); // Clear input after sending
    };


    return (
        <div className="w-full min-h-screen  bg-black">
            <div className="container mx-auto max-w-screen-sm  min-w-screen px-10 py-8">
            <div className="flex items-center justify-center mb-4">
                <img
                    src={githubLogo.src} // GitHub logo
                    alt="GitHub Logo"
                    className="h-10 w-10 mr-2" // Adjust height and width as needed
                />
                <h1 className="text-4xl font-bold text-white">GitChat</h1>
            </div>
            {showInputs && (
                <form onSubmit={handleSubmit} className = "flex items-center space-x-2" >
                    <input
                        className="flex-grow border border-gray-100 rounded-3xl p-2  bg-black text-white"
                        value = {githubRepo}
                        onChange={(e) => setGithubRepo(e.target.value)}
                        placeholder = "Enter the link of the github repository"
                    >
                    </input>
                    <br/>
                    <button 
                        className={`px-4 py-2 text-white text-xl rounded-3xl ${loading ? 'bg-gray-800' : 'bg-blue-500 hover:bg-blue-600'}`}
                        type="submit" disabled={loading}>
                        {loading ? 'Loading...' : 'Submit'}
                    </button>
                </form>
            )}
            
            {response && (
                <div className={`mt-4 p-4 rounded-lg ${error ?  'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}  animate-fadeIn`}>
                    <p className = "text-l font-medium">{response}</p>
                </div>
            )}

            {finalMessage && (
                <div className={`mt-4 p-4 rounded-lg bg-blue-200 text-blue-800 animate-fadeIn`}>
                    <p className = "text-l font-medium" dangerouslySetInnerHTML={{ __html: finalMessage }}></p>
                </div>
            )}

            {deleteRepoMessage && (
                <div className="container flex items-center justify-center max-auto px-25 py-5 space-x-4 animate-fadeIn">
                    <button 
                        onClick={handleRemoveRepo}
                        className={`px-4 py-2 text-white rounded ${loading ? 'bg-gray-800' : 'bg-red-500 hover:bg-red-600'}`}
                        type="submit" disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete Repository'}
                    </button>
                </div>
            )}
        </div>
            <form onSubmit={handleChatSubmit} className="fixed bottom-0 left-0 w-full  p-4">
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
        </div>
        
    )
}   