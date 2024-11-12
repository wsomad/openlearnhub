import {BiSearch} from 'react-icons/bi'; // Importing a different search icon

const SearchBar = ({query, handleInputChange}) => {
    return (
        <div className='relative w-3/4 mx-auto mt-8'>
            {/* Search Icon */}
            <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600'>
                <BiSearch size={20} />
            </div>
            <input
                type='text'
                value={query}
                onChange={handleInputChange}
                placeholder='Search for any course...'
                className='w-full font-abhaya text-lg pl-10 pr-4 py-2 border border-gray rounded-full focus:outline-none focus:ring-2 focus:ring-primary' // Adjusted padding to make space for the icon and increased height
            />
        </div>
    );
};

export default SearchBar;
