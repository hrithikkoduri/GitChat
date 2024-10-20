import React from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ darkMode, toggleDarkMode }: { darkMode: boolean, toggleDarkMode: () => void }) => {
    return (
        <div className="fixed top-4 left-4">
            <label className="flex items-center cursor-pointer">
                <div className="relative">
                    <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={darkMode}
                        onChange={toggleDarkMode}
                    />
                    <div className={`w-14 h-7 rounded-full shadow-inner transition-colors duration-300 ease-in-out ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 w-5 h-5 rounded-full transition-transform duration-300 ease-in-out flex items-center justify-center ${
                        darkMode 
                            ? 'translate-x-7 bg-gray-300' 
                            : 'bg-white'
                    }`}>
                        {darkMode 
                            ? <Moon size={12} className="text-gray-800" /> 
                            : <Sun size={12} className="text-yellow-500" />
                        }
                    </div>
                </div>
                <span className={`ml-3 text-sm font-medium transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                    {darkMode ? 'Dark' : 'Light'} Mode
                </span>
            </label>
        </div>
    );
};

export default ThemeToggle;