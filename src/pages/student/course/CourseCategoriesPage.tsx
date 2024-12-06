import { useEffect, useState } from "react";
import { useCourses } from "../../../hooks/useCourses";
import { useUser } from "../../../hooks/useUser";
import { Course } from "../../../types/course";
import HeaderComponent from "../../../components/HeaderComponent";
import CardCategories from "../../../components/card/CardCategories";

const CourseCategoriesPage: React.FC = () => {
    const { allCourses, fetchAllCourses } = useCourses();
    const { currentUser, userRole } = useUser();
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [courseTypes, setCourseTypes] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

    useEffect(() => {
        const loadCourses = async () => {
            if (currentUser?.uid) {
                const courses = await fetchAllCourses(
                    currentUser?.uid,
                    userRole,
                    'default',
                    sortBy,
                    true,
                    undefined,
                    courseTypes
                );
                setFilteredCourses(courses);
                console.log('Course categories', courses);
            }
        };
        loadCourses();
    }, [currentUser, userRole, courseTypes, sortBy]);

    const handleCourseType = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        setCourseTypes((checkType) => (checked ? [...checkType, value] : checkType.filter((type) => type !== value)));
    };

    return (
        <div>
            <HeaderComponent />
            <CardCategories></CardCategories>
        </div>
    );
};

export default CourseCategoriesPage;
