interface ResponseMessageProps {
    message: string;
    error: boolean;
    finalMessage?: string;
}

export default function ResponseMessage({ message, error, finalMessage }: ResponseMessageProps) {
    if (!message && !finalMessage) return null;

    return (
        <div className={`mt-4 p-4 rounded-lg ${error ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'} animate-fadeIn`}>
            <p className="text-l font-medium" dangerouslySetInnerHTML={{ __html: finalMessage || message }}></p>
        </div>
    );
}
