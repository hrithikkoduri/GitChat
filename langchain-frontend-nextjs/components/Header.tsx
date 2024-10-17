import githubLogo from '../logo.png';

export default function Header() {
    return (
        <div className="flex items-center justify-center mb-4">
            <img
                src={githubLogo.src} // GitHub logo
                alt="GitHub Logo"
                className="h-10 w-10 mr-2" // Adjust height and width as needed
            />
            <h1 className="text-4xl font-bold text-white">GitChat</h1>
        </div>
    );
}