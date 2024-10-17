import {useState} from 'react';


export default function Home() {
    const [githubRepo, setGithubRepo] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [showInputs, setShowInputs] = useState(true);
    const [finalMessage, setFinalMessage] = useState('');
    const [deleteRepoMessage, setDeleteRepoMessage] = useState('');



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


    return (
        <div className="container max-auto px-20 py-8">
            <h1 className="text-4xl font-bold mb-4">GitChat v2</h1>
            {showInputs && (
                <form onSubmit={handleSubmit} className = "flex items-center space-x-2" >
                    <input
                        className="flex-grow border rounded p-2 "
                        value = {githubRepo}
                        onChange={(e) => setGithubRepo(e.target.value)}
                        placeholder = "Enter the link of the github repository"
                    >
                    </input>
                    <br/>
                    <button 
                        className={`px-4 py-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
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
                <div className="container flex items-center max-auto px-25 py-5 space-x-4 animate-fadeIn">
                    <p className = "text-l font-medium">{deleteRepoMessage}</p>
                    <button 
                        onClick={handleRemoveRepo}
                        className={`px-4 py-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'}`}
                        type="submit" disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            )}

        </div>
    )
}   