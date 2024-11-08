import React, {useState} from 'react';

function CardCourseComponent() {
    const [thumbnail, setThumbnail] = useState('');
    const [title, setTitle] = useState('');
    const [instructor, setInstructor] = useState('');
    const [pricing, setPricing] = useState('');
    const [button, setButton] = useState();
    const [progression, setProgression] = useState(false);

    return <div>CardCourseComponent</div>;
}

export default CardCourseComponent;
