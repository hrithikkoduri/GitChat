import {useState} from 'react';


export default function Home() {
    const [githubRepo, setGithubRepo] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log("Github Repo: ", githubRepo)
        
        try{
            /*
            const res = await fetch('http://localhost:8000/generate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({question}),
                
            });
            

            const data = await res.json();
            setResponse(data.response);
            */
            setResponse(githubRepo);

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
            <h1 className="text-4xl font-bold mb-4">GitChat v1</h1>
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

            {response && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold">Response:</h2>
                    <p>{response}</p>
                </div>
            )}
        </div>
    )
}   
