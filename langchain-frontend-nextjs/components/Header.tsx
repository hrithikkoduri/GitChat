import githubLogo from '../logo.png';

export default function Header({ mode }: { mode: boolean }) {
    return (
        <div className="flex items-center justify-center mt-4 mb-4">
            <img
                src={githubLogo.src} // GitHub logo
                alt="GitHub Logo"
                className="h-10 w-10 mr-2" // Adjust height and width as needed
            />
            <h1 className = {`${mode ? `text-gray-400` : `text-black`} text-4xl font-bold`}>GitChat</h1>
        </div>
    );
}