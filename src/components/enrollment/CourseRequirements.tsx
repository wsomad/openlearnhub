import React from 'react';
import {RiTimer2Line} from 'react-icons/ri';
import {HiOutlineDocumentText} from 'react-icons/hi';
import {MdQuiz} from 'react-icons/md';

function CourseRequirements() {
    return (
        <div>
            <h2 className='font-abhaya text-2xl font-bold mb-2'>
                Course Details
            </h2>
            <hr className='border-t gray opacity-15 mb-4' />
            <p className='font-abhaya text-lg'>
                This course provides a comprehensive introduction to building
                web applications using React and Redux. Perfect for both
                beginners and experienced developers.
            </p>
            <ul className='font-abhaya text-lg list-disc list-inside mt-4'>
                <li>Introduction to React and Redux</li>
                <li>State Management with Redux Toolkit</li>
                <li>Building Components with Redux Toolkit</li>
                <li>Advanced React Techniques</li>
                <li>Creating and Managing Redux Slices</li>
                <li>Using createAsyncThunk for Asynchronous Actions</li>
                <li>Handling Side Effects in Redux</li>
                <li>Middleware and Custom Middleware in Redux</li>
                <li>Integrating Redux with API Data Fetching</li>
                <li>Persisting State with Redux Persist</li>
                <li>Debugging Redux State with DevTools</li>
                <li>Testing Redux-Integrated Components</li>
                <li>Best Practices in Redux Architecture</li>
                <li>Optimizing Redux for Performance</li>
                <li>Building a Scalable Redux-Based Project</li>
            </ul>
        </div>
    );
}

export default CourseRequirements;
