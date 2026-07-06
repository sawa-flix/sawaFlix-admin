'use client'
import React, { useState, useEffect, useRef } from 'react';

import Image from 'next/image';


// The main application component
const App = () => {
    // State to manage password visibility for the password and confirm password fields
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    // State for the category dropdown menu
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Select a Category');

    // State for form submission status and success message
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Ref to handle clicks outside the dropdown to close it
    const dropdownRef = useRef(null);

    // Toggle function for password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Toggle function for confirm password visibility
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    // Handle form submission
    const handleSignUp = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        setIsLoading(true); // Set loading state to true

        // Simulate a sign-up request with a timeout
        setTimeout(() => {
            setIsLoading(false); // Set loading state to false
            setMessage("Successfully signed up as an artist!"); // Set success message
            
            // Hide the message after 3 seconds
            setTimeout(() => {
                setMessage('');
            }, 3000);
            
            // In a real application, you would handle successful sign-up here, 
            // e.g., redirecting the user or clearing the form.
        }, 2000); // Simulate a 2-second network request
    };

    // Close the dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        // Add event listener when the dropdown is open
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    // Inline style for the background image
    const backgroundStyle = {
        backgroundImage: "url('/hero-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };
    
    
    

    return (
        // The main container is now more responsive with fluid padding (p-4) on small screens,
        // which scales up to p-8 on medium screens and p-10 on large screens.
        <div className="flex items-center justify-center min-h-screen p-4 sm:p-8 md:p-10" style={backgroundStyle}>
            {/* Background image overlay */}
            <div className="absolute inset-0 bg-black opacity-70"></div>
            
            {/* Sign-up Form Container */}
            <div className="relative z-10 w-full max-w-lg p-8 bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-lg">

                {/* Title */}
                <h1 className="text-3xl font-bold text-center text-white mb-6">Artist sign-up</h1>

                {/* Success Message Pop-up */}
                {message && (
                    <div className="text-center bg-green-500 text-white p-2 rounded-md mb-4">
                        {message}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSignUp} className="space-y-4">
                    {/* Name Input */}
                    <div>
                        <label htmlFor="name" className="sr-only">Name</label>
                        <input id="name" name="name" type="text" autoComplete="name" required className="relative block w-full appearance-none rounded-md border border-gray-700 px-3 py-4 text-gray-100 placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-gray-800" placeholder="Name" />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email-address" className="sr-only">Email address</label>
                        <input id="email-address" name="email" type="email" autoComplete="email" required className="relative block w-full appearance-none rounded-md border border-gray-700 px-3 py-4 text-gray-100 placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-gray-800" placeholder="Email address" />
                    </div>

                    {/* Password Input with Toggle */}
                    <div className="relative group">
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input id="password" name="password" type={passwordVisible ? 'text' : 'password'} autoComplete="new-password" required className="relative block w-full appearance-none rounded-md border border-gray-700 px-3 py-4 text-gray-100 placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-gray-800" placeholder="Password" />
                        <span onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer opacity-100">
                            {passwordVisible ? (
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395m-4.64-2.115a4.5 4.5 0 113.35-6.425M21.75 12C20.462 7.662 16.44 4.5 12 4.5c-.993 0-1.953.138-2.863.395m-4.64-2.115a4.5 4.5 0 113.35-6.425M21.75 12C20.462 7.662 16.44 4.5 12 4.5c-.993 0-1.953.138-2.863.395m-4.64-2.115a4.5 4.5 0 113.35-6.425" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21L3 3" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.575 3.01 9.963 7.823a1.012 1.012 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.575-3.01-9.963-7.823z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </span>
                    </div>

                    {/* Confirm Password Input with Toggle */}
                    <div className="relative group">
                        <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                        <input id="confirm-password" name="confirm-password" type={confirmPasswordVisible ? 'text' : 'password'} autoComplete="new-password" required className="relative block w-full appearance-none rounded-md border border-gray-700 px-3 py-4 text-gray-100 placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-gray-800" placeholder="Confirm Password" />
                        <span onClick={toggleConfirmPasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer opacity-100">
                            {confirmPasswordVisible ? (
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395m-4.64-2.115a4.5 4.5 0 113.35-6.425M21.75 12C20.462 7.662 16.44 4.5 12 4.5c-.993 0-1.953.138-2.863.395m-4.64-2.115a4.5 4.5 0 113.35-6.425M21.75 12C20.462 7.662 16.44 4.5 12 4.5c-.993 0-1.953.138-2.863.395m-4.64-2.115a4.5 4.5 0 113.35-6.425" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21L3 3" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.575 3.01 9.963 7.823a1.012 1.012 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.575-3.01-9.963-7.823z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </span>
                    </div>

                    {/* Category Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <label htmlFor="category" className="sr-only">Category</label>
                        <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="relative flex w-full appearance-none rounded-md border border-gray-700 px-3 py-4 text-gray-100 placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-gray-800 justify-between items-center cursor-pointer">
                            <span id="category-selected-text">{selectedCategory}</span>
                            <svg className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 w-full rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="category-dropdown-btn">
                                    {['Amapiano', 'Hip-pop', 'Bitkusi', 'Musician', 'Other'].map(category => (
                                        <div key={category} onClick={() => { setSelectedCategory(category); setIsDropdownOpen(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white cursor-pointer" role="menuitem">
                                            {category}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Hidden input to hold the selected value */}
                        <input type="hidden" name="category" id="hidden-category-input" value={selectedCategory !== 'Select a Category' ? selectedCategory : ''} />
                    </div>

                    {/* Checkbox for Artist/Producer */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
                        <div className="flex items-center">
                            <input id="is-artist" name="role" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <label htmlFor="is-artist" className="ml-2 block text-sm text-gray-300">I am an Artist</label>
                        </div>
                        <div className="flex items-center">
                            <input id="is-producer" name="role" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <label htmlFor="is-producer" className="ml-2 block text-sm text-gray-300">I am a Producer</label>
                        </div>
                    </div>

                    {/* Sign-Up Button */}
                    <div className="mt-6">
                        <button type="submit" disabled={isLoading} className="group relative flex w-full justify-center rounded-md border border-transparent bg-red-600 py-4 px-4 text-lg font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-800 disabled:cursor-not-allowed cursor-pointer">
                            {isLoading ? 'Loading...' : 'Sign up'}
                        </button>
                    </div>
                </form>

                {/* Login Link */}
                <div className="text-sm text-center mt-6 ">
                    <span className="text-gray-400">Already have an account?</span>
                    <a href="#" className="font-medium text-red-500 hover:text-red-400">
                        Log in
                    </a>
                </div>
            </div>
        </div>
    );
};

export default App;
