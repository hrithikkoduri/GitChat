import {useState} from 'react';

export default function Home() {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log("Question: ", question)
        try{
            const res = await fetch('http://localhost:8000/generate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({question}),
                
            });
            

            const data = await res.json();
            setResponse(data.response);

        }
        catch(err){
            console.error("Error fetching response", err);
        }
        finally{
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Langchain with fastAPI & Next.js</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value = {question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder = "Enter your question here"
                    rows={5}
                    cols={50}
                >
                </textarea>
                <br/>
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Generate Response'}
                </button>
            </form>

            {response && (
                <div>
                    <h2>Response:</h2>
                    <p>{response}</p>
                </div>
            )}
        </div>
    )
}   
