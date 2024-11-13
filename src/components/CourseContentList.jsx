import CourseContentView from './CourseContentView';
import {FaPlus} from 'react-icons/fa6';

const CourseContentList = ({userType}) => {
    // Define container styles based on user type (student or instructor)
    const containerClass =
        userType === 'student'
            ? 'font-abhaya w-[400px] h-[550px] overflow-y-auto shadow-md p-4 bg-white'
            : 'font-abhaya mt-24 ml-12 w-[1160px] h-[850px] overflow-y-auto shadow-md p-4 bg-white';

    return (
        <div className={containerClass}>
            <div className='mb-2 font-bold text-xl flex justify-between items-center'>
                <span>Course Content</span>
                {userType === 'instructor' && (
                    <button
                        className='bg-secondary text-white px-3 py-2 rounded-md flex items-center mr-6'
                        onClick={() => {
                            console.log('Add new section clicked');
                        }}
                    >
                        <FaPlus />
                    </button>
                )}
            </div>
            <div className='-mx-4'>
                <hr className='border-t border-gray' />
            </div>
            <CourseContentView userType={userType} />
        </div>
    );
};

export default CourseContentList;
