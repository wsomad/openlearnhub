import React from 'react';
import {useState} from 'react';

const HeaderComponent = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    return (
        <header className='flex items-center justify-between p-4 bg-blue-600'>
            <div className='flex items-center space-x-4'>
                <div className='text-2xl font-bold text-white'>
                    <span>Learn</span>
                    <span className='ml-1'>Hub</span>
                </div>

                <div className='relative'>
                    <button
                        onClick={toggleDropdown}
                        className='text-white bg-gray-800 hover:bg-gray-700 p-2 rounded-md'
                    >
                        Categories
                    </button>

                    {isDropdownOpen && (
                        <div className='absolute bg-white text-black mt-2 rounded-md shadow-lg'>
                            <ul>
                                <li className='p-2 hover:bg-gray-200'>
                                    Web Development
                                </li>
                                <li className='p-2 hover:bg-gray-200'>
                                    Mobile Development
                                </li>
                                <li className='p-2 hover:bg-gray-200'>
                                    Robotics
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className='flex space-x-4'>
                <button className='text-white bg-blue-700 hover:bg-blue-600 py-2 px-4 rounded-md'>
                    Sign In
                </button>
                <button className='text-white bg-green-600 hover:bg-green-500 py-2 px-4 rounded-md'>
                    Get Started
                </button>
            </div>
        </header>
    );
};

export default HeaderComponent;
