import {useState} from 'react';


export default function Home() {
    const [githubRepo, setGithubRepo] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [showInputs, setShowInputs] = useState(true);
    const [finalMessage, setFinalMessage] = useState('');


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
                setError(true);

                setTimeout(() => {
                    setShowInputs(false);
                    setResponse('');
                    setFinalMessage(`All files stored in the database from  <span class="underline">${githubRepo}</span>. Now let's chat!`);
                }, 3000);

            }
            else{
                setResponse(`Error loading files from ${githubRepo} : ${data.error}`);
            }

        }
        catch(err){
            console.error("Error fetching response", err);
        }
        finally{
            setLoading(false);
        }

    };

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
                <div className={`mt-4 p-4 rounded-lg ${error ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    <p className = "text-l font-medium">{response}</p>
                </div>
            )}

            {finalMessage && (
                <div className={`mt-4 p-4 rounded-lg bg-blue-200 text-blue-800`}>
                    <p className = "text-l font-medium" dangerouslySetInnerHTML={{ __html: finalMessage }}></p>
                </div>
            )}
        </div>
    )
}   
