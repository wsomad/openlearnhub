// import {GripVertical} from 'lucide-react';
// import React, {useState} from 'react';

// import {
//     closestCenter,
//     DndContext,
//     DragEndEvent,
//     KeyboardSensor,
//     PointerSensor,
//     useSensor,
//     useSensors,
// } from '@dnd-kit/core';
// import {
//     arrayMove,
//     SortableContext,
//     sortableKeyboardCoordinates,
//     useSortable,
//     verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import {CSS} from '@dnd-kit/utilities';
// import {Lesson, VideoLesson} from '../../../types/lesson';
// import {Section} from '../../../types/section';
// import CourseLesson from './CourseLesson';
// import {useSections} from '../../../hooks/useSections';
// import {Course} from '../../../types/course';

// interface SortableCourseSectionProps {
//     section: Section;
//     index: number;
//     role: 'student' | 'instructor';
//     canEdit: boolean;
//     onDeleteSection: (section_id: string) => void;
//     onEditSectionTitle: (section_id: string, new_title: string) => void;
//     onAddLesson: (
//         section_id: string,
//         lesson: Omit<Lesson, 'lesson_id'>,
//     ) => void;
//     onEditLesson: (
//         section_id: string,
//         lesson_id: string,
//         updatedLesson: Partial<Lesson>,
//     ) => void;
//     onDeleteLesson: (section_id: string, lesson_id: string) => void;
// }

// interface CourseContentViewProps {
//     role: 'student' | 'instructor';
//     course_id: string;
//     sections: Section[];
//     //setsections: React.Dispatch<React.SetStateAction<Section[]>>;
//     canEdit: boolean;
//     onDeleteSection: (section_id: string) => void;
//     onEditSectionTitle: (section_id: string, new_title: string) => void;
//     onAddLesson: (
//         section_id: string,
//         lesson: Omit<Lesson, 'lesson_id'>,
//     ) => void;
//     onEditLesson: (
//         section_id: string,
//         lesson_id: string,
//         updatedLesson: Partial<Lesson>,
//     ) => void;
//     onDeleteLesson: (section_id: string, lesson_id: string) => void;
// }

// // Switch section position by drag & drop.
// const SortableCourseSection: React.FC<SortableCourseSectionProps> = ({
//     section,
//     index,
//     role,
//     canEdit,
//     onDeleteSection,
//     onEditSectionTitle,
//     onAddLesson,
//     onEditLesson,
//     onDeleteLesson,
// }) => {
//     const {
//         attributes,
//         listeners,
//         setNodeRef,
//         transform,
//         transition,
//         isDragging,
//     } = useSortable({id: section.section_id});

//     const style = {
//         transform: CSS.Transform.toString(transform),
//         transition,
//         zIndex: isDragging ? 1000 : 1,
//         opacity: isDragging ? 0.5 : 1,
//     };

//     // const totalDuration = section.lessons.reduce((acc, lesson) => {
//     //     if (lesson.lesson_type === 'video') {
//     //         return acc + (lesson as VideoLesson).video_duration / 60;
//     //     }
//     //     return acc;
//     // }, 0);

//     const DragHandle = () => (
//         <div
//             {...attributes}
//             {...listeners}
//             className='absolute cursor-move flex items-center justify-center h-full px-2 text-gray-400 hover:text-gray-600'
//             style={{left: '-20px'}}
//         >
//             <GripVertical size={20} />
//         </div>
//     );

//     return (
//         <div ref={setNodeRef} style={style}>
//             <div className='relative'>
//                 {canEdit && role === 'instructor' && <DragHandle />}
//                 <CourseLesson
//                     section={section}
//                     index={index}
//                     lessonCount={section.lessons?.length || 0}
//                     // totalDuration={totalDuration || 0}
//                     totalDuration={0}
//                     role={role}
//                     canEdit={canEdit}
//                     onDeleteSection={onDeleteSection}
//                     onEditSectionTitle={onEditSectionTitle}
//                     onAddLesson={onAddLesson}
//                     onEditLesson={onEditLesson}
//                     onDeleteLesson={onDeleteLesson}
//                 />
//             </div>
//         </div>
//     );
// };

// const CourseContentView: React.FC<CourseContentViewProps> = ({
//     role,
//     course_id,
//     sections,
//     //setsections,
//     canEdit,
//     onDeleteSection,
//     onEditSectionTitle,
//     onAddLesson,
//     onEditLesson,
//     onDeleteLesson,
// }) => {
//     const sensors = useSensors(
//         useSensor(PointerSensor, {
//             activationConstraint: {
//                 distance: 8,
//             },
//         }),
//         useSensor(KeyboardSensor, {
//             coordinateGetter: sortableKeyboardCoordinates,
//         }),
//     );
//     const {selectedSection, allSections, updateSection} = useSections();
//const [setSectionsOrder] = useState<Course[]>();

// const handleDragEnd = async (event: DragEndEvent): Promise<void> => {
//     if (!canEdit) return;

//     const {active, over} = event;

//     if (over && active.id !== over.id) {
//         // Find the old and new index positions of the sections.
//         const oldIndex = allSections.findIndex(
//             (section) => section.section_id === active.id,
//         );
//         const newIndex = allSections.findIndex(
//             (section) => section.section_id === over.id,
//         );

//         if (oldIndex !== -1 && newIndex !== -1) {
//             // Reorder the sections using arrayMove.
//             const updatedSections = arrayMove(
//                 allSections,
//                 oldIndex,
//                 newIndex,
//             );

//             // // Update the 'order' for each section based on its new index
//             // updatedSections.forEach((section) => {
//             //     // Update the order (or any other properties you need to adjust)
//             //     ...section,
//             //     section.section_order = newIndex;
//             // });

//             // const updatedData: Partial<Section[]> = updatedSections.map(
//             //     (section) => ({
//             //         section_id: section.section_id,
//             //         section_order: section.section_order,
//             //     }),
//             // );
//             const updatedSectionsWithOrder = updatedSections.map(
//                 (section, index) => ({
//                     ...section,
//                     section_order: index + 1,
//                 }),
//             );

//             const updatedData: Partial<Section>[] =
//                 updatedSectionsWithOrder.map((section) => ({
//                     section_id: section.section_id,
//                     section_order: section.section_order,
//                 }));

//             // Instead of updating immediately in Firebase, call updateSection in bulk.
//             try {
//                 // Update section batch to Firebase.
//                 await updateSection(
//                     course_id,
//                     selectedSection?.section_id || '',
//                     updatedData,
//                 );
//                 console.log('Sections reordered and updated successfully');
//             } catch (error) {
//                 console.error(
//                     'Error updating sections order in Firebase:',
//                     error,
//                 );
//             }
// setsections((sections) => {
//     const oldIndex = sections.findIndex(
//         (section) => section.section_id === active.id,
//     );
//     const newIndex = sections.findIndex(
//         (section) => section.section_id === over.id,
//     );

//     return arrayMove(sections, oldIndex, newIndex);
// });
//         }
//     }
// };
// const handleDragEnd = async (event: DragEndEvent): Promise<void> => {
//     if (!canEdit) return;

//     const {active, over} = event;

//     if (over && active.id !== over.id) {
//         // Find the old and new index positions of the sections.
//         const oldIndex = allSections.findIndex(
//             (section) => section.section_id === active.id,
//         );
//         const newIndex = allSections.findIndex(
//             (section) => section.section_id === over.id,
//         );

//         if (oldIndex !== -1 && newIndex !== -1) {
//             // Reorder the sections using arrayMove.
//             const updatedSections = arrayMove(
//                 allSections,
//                 oldIndex,
//                 newIndex,
//             );

//             // Update the section order to reflect the new positions
//             const updatedSectionsWithOrder = updatedSections.map(
//                 (section, index) => ({
//                     ...section,
//                     section_order: index + 1, // Adjust the order based on new index
//                 }),
//             );

//             const updatedData: Partial<Section>[] =
//                 updatedSectionsWithOrder.map((section) => ({
//                     section_id: section.section_id,
//                     section_order: section.section_order,
//                 }));

//             try {
//                 // Immediately update Firestore with new section order
//                 await updateSection(
//                     course_id,
//                     selectedSection?.section_id || '',
//                     updatedData,
//                 );
//                 console.log(
//                     'Sections reordered and updated successfully in Firestore',
//                 );
//             } catch (error) {
//                 console.error(
//                     'Error updating section order in Firestore:',
//                     error,
//                 );
//             }
//         }
//     }
// };
//     return (
//         <div className='font-abhaya w-full bg-white'>
//             <DndContext
//                 sensors={sensors}
//                 collisionDetection={closestCenter}
//                 onDragEnd={handleDragEnd}
//             >
//                 <SortableContext
//                     items={sections.map((section) => section.section_id)}
//                     strategy={verticalListSortingStrategy}
//                 >
//                     {sections.map((section, index) => (
//                         <SortableCourseSection
//                             key={section.section_id}
//                             section={section}
//                             index={index + 1}
//                             role={role}
//                             canEdit={canEdit}
//                             onDeleteSection={onDeleteSection}
//                             onEditSectionTitle={onEditSectionTitle}
//                             onAddLesson={onAddLesson}
//                             onEditLesson={onEditLesson}
//                             onDeleteLesson={onDeleteLesson}
//                         />
//                     ))}
//                 </SortableContext>
//             </DndContext>
//         </div>
//     );
// };

// export default CourseContentView;

// import {GripVertical} from 'lucide-react';
// import React, {useEffect, useState} from 'react';
// import {
//     closestCenter,
//     DndContext,
//     DragEndEvent,
//     KeyboardSensor,
//     PointerSensor,
//     useSensor,
//     useSensors,
// } from '@dnd-kit/core';
// import {
//     arrayMove,
//     SortableContext,
//     sortableKeyboardCoordinates,
//     useSortable,
//     verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import {CSS} from '@dnd-kit/utilities';
// import {Section} from '../../../types/section';
// import CourseLesson from './CourseLesson';
// import {useSections} from '../../../hooks/useSections';
// import {Lesson} from '../../../types/lesson';

// interface SortableCourseSectionProps {
//     section: Section;
//     index: number;
//     role: 'student' | 'instructor';
//     canEdit: boolean;
//     onDeleteSection: (section_id: string) => void;
//     onEditSectionTitle: (section_id: string, new_title: string) => void;
//     onAddLesson: (
//         section_id: string,
//         lesson: Omit<Lesson, 'lesson_id'>,
//     ) => void;
//     onEditLesson: (
//         section_id: string,
//         lesson_id: string,
//         updatedLesson: Partial<Lesson>,
//     ) => void;
//     onDeleteLesson: (section_id: string, lesson_id: string) => void;
// }

// const SortableCourseSection: React.FC<SortableCourseSectionProps> = ({
//     section,
//     index,
//     role,
//     canEdit,
//     onDeleteSection,
//     onEditSectionTitle,
//     onAddLesson,
//     onEditLesson,
//     onDeleteLesson,
// }) => {
//     const {
//         attributes,
//         listeners,
//         setNodeRef,
//         transform,
//         transition,
//         isDragging,
//     } = useSortable({
//         id: section.section_id,
//     });

//     const style = {
//         transform: CSS.Transform.toString(transform),
//         transition,
//         zIndex: isDragging ? 1000 : 1,
//         opacity: isDragging ? 0.5 : 1,
//     };

//     const DragHandle = () => (
//         <div
//             {...attributes}
//             {...listeners}
//             className='absolute cursor-move flex items-center justify-center h-full px-2 text-gray-400 hover:text-gray-600'
//             style={{left: '-20px'}}
//         >
//             <GripVertical size={20} />
//         </div>
//     );

//     return (
//         <div ref={setNodeRef} style={style}>
//             <div className='relative'>
//                 {canEdit && role === 'instructor' && <DragHandle />}
//                 <CourseLesson
//                     section={section}
//                     index={index}
//                     lessonCount={section.lessons?.length || 0}
//                     totalDuration={0}
//                     role={role}
//                     canEdit={canEdit}
//                     onDeleteSection={onDeleteSection}
//                     onEditSectionTitle={onEditSectionTitle}
//                     onAddLesson={onAddLesson}
//                     onEditLesson={onEditLesson}
//                     onDeleteLesson={onDeleteLesson}
//                 />
//             </div>
//         </div>
//     );
// };

// interface CourseContentViewProps {
//     role: 'student' | 'instructor';
//     course_id: string;
//     sections: Section[];
//     //setsections: React.Dispatch<React.SetStateAction<Section[]>>;
//     canEdit: boolean;
//     onDeleteSection: (section_id: string) => void;
//     onEditSectionTitle: (section_id: string, new_title: string) => void;
//     onAddLesson: (
//         section_id: string,
//         lesson: Omit<Lesson, 'lesson_id'>,
//     ) => void;
//     onEditLesson: (
//         section_id: string,
//         lesson_id: string,
//         updatedLesson: Partial<Lesson>,
//     ) => void;
//     onDeleteLesson: (section_id: string, lesson_id: string) => void;
// }

// const CourseContentView: React.FC<CourseContentViewProps> = ({
//     role,
//     course_id,
//     sections,
//     canEdit,
//     onDeleteSection,
//     onEditSectionTitle,
//     onAddLesson,
//     onEditLesson,
//     onDeleteLesson,
// }) => {
//     const sensors = useSensors(
//         useSensor(PointerSensor, {activationConstraint: {distance: 8}}),
//         useSensor(KeyboardSensor, {
//             coordinateGetter: sortableKeyboardCoordinates,
//         }),
//     );

//     const {selectedSection, allSections, updateSection} = useSections();
//     const [sectionsOrder, setSectionsOrder] = useState<Section[]>([]); // Track section order

//     useEffect(() => {
//         if (sections && sections.length > 0) {
//             setSectionsOrder(sections);
//         }
//     }, [sections]);

//     // Handle drag end event and update the section order in the state
//     const handleDragEnd = async (event: DragEndEvent): Promise<void> => {
//         if (!canEdit) return;

//         const {active, over} = event;

//         if (over && active.id !== over.id) {
//             // Find the old and new index positions of the sections.
//             const oldIndex = sections.findIndex(
//                 (section) => section.section_id === active.id,
//             );
//             const newIndex = sections.findIndex(
//                 (section) => section.section_id === over.id,
//             );

//             if (oldIndex !== -1 && newIndex !== -1) {
//                 // Reorder the sections using arrayMove.
//                 const updatedSections = arrayMove(sections, oldIndex, newIndex);

//                 // Update the order property based on new index
//                 const updatedSectionsWithOrder = updatedSections.map(
//                     (section, index) => ({
//                         ...section,
//                         section_order: index + 1, // Adjust the order based on new index
//                     }),
//                 );

//                 setSectionsOrder(updatedSectionsWithOrder); // Update local state

//                 // Update Firestore after user clicks save
//                 console.log('Sections reordered locally');
//             }
//         }
//     };

//     // Function to save the updated sections order to Firestore
//     const handleSaveOrder = async () => {
//         try {
//             const updatedData = sectionsOrder.map((section) => ({
//                 section_id: section.section_id,
//                 section_order: section.section_order,
//             }));

//             // Call the updateSection function to save the order to Firestore
//             await updateSection(
//                 course_id,
//                 selectedSection?.section_id || '',
//                 updatedData,
//             );
//             console.log('Sections order saved to Firestore');
//         } catch (error) {
//             console.error('Error saving section order:', error);
//         }
//     };

//     return (
//         <div className='font-abhaya w-full bg-white'>
//             <DndContext
//                 sensors={sensors}
//                 collisionDetection={closestCenter}
//                 onDragEnd={handleDragEnd}
//             >
//                 <SortableContext
//                     items={sectionsOrder.map((section) => section.section_id)}
//                     strategy={verticalListSortingStrategy}
//                 >
//                     {sectionsOrder.map((section, index) => (
//                         <SortableCourseSection
//                             key={section.section_id}
//                             section={section}
//                             index={index + 1}
//                             role={role}
//                             canEdit={canEdit}
//                             onDeleteSection={onDeleteSection}
//                             onEditSectionTitle={onEditSectionTitle}
//                             onAddLesson={onAddLesson}
//                             onEditLesson={onEditLesson}
//                             onDeleteLesson={onDeleteLesson}
//                         />
//                     ))}
//                 </SortableContext>
//             </DndContext>
//             {canEdit && (
//                 <button
//                     onClick={handleSaveOrder}
//                     className='mt-4 bg-blue-500 text-white py-2 px-4 rounded'
//                 >
//                     Save Order
//                 </button>
//             )}
//         </div>
//     );
// };

// export default CourseContentView;

import React, {useEffect, useState} from 'react';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {Section} from '../../../types/section';
import {useSections} from '../../../hooks/useSections';
import {useUser} from '../../../hooks/useUser';
import {Lesson} from '../../../types/lesson';
import SortableCourseSection from './SortableCourseSection';

interface CourseContentViewProps {
    course_id: string;
    canEdit: boolean;
    sectionsOrder: Section[]; // Receive state
    setSectionsOrder: React.Dispatch<React.SetStateAction<Section[]> | []>; // Receive state updater
    onSaveOrder: () => void;
    onDeleteSection: (section_id: string) => void;
    onEditSectionTitle: (section_id: string, new_title: string) => void;
    onAddLesson: (
        section_id: string,
        lesson: Omit<Lesson, 'lesson_id'>,
    ) => void;
    onEditLesson: (
        section_id: string,
        lesson_id: string,
        updatedLesson: Partial<Lesson>,
    ) => void;
    onDeleteLesson: (section_id: string, lesson_id: string) => void;
}

const CourseContentView: React.FC<CourseContentViewProps> = ({
    course_id,
    canEdit,
    sectionsOrder,
    setSectionsOrder,
    onSaveOrder,
    onDeleteSection,
    onEditSectionTitle,
    onAddLesson,
    onEditLesson,
    onDeleteLesson,
}) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {activationConstraint: {distance: 8}}),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const {selectedSection, allSections, fetchAllSections, updateSection} =
        useSections();
    const {currentUser, userRole} = useUser();
    //const [sectionsOrder, setSectionsOrder] = useState<Section[]>([]);

    // // Run side effect to fetch all sections based on `courseId`.
    // useEffect(() => {
    //     if (!course_id) {
    //         return;
    //     }

    //     const loadSection = async () => {
    //         try {
    //             if (course_id) {
    //                 await fetchAllSections(course_id);
    //                 console.log('List of lessons to edit:', allSections);
    //             }
    //         } catch (error) {
    //             console.error('Failed to fetch a list of lessons:', error);
    //         }
    //     };

    //     loadSection();
    // }, [course_id]);

    // // Run this side effect to sort section order.
    // useEffect(() => {
    //     if (allSections && allSections.length > 0) {
    //         const sortedSections = [...allSections].sort(
    //             (a, b) => (a.section_order || 0) - (b.section_order || 0),
    //         );
    //         setSectionsOrder(sortedSections);
    //     }
    // }, [allSections]);

    // Handle drag function to rearrange the position of section.
    const handleDragEnd = async (event: DragEndEvent): Promise<void> => {
        if (!canEdit) return;

        const {active, over} = event;

        // if (over && active.id !== over.id) {
        //     const oldIndex = sectionsOrder.findIndex(
        //         (section) => section.section_id === active.id,
        //     );
        //     const newIndex = sectionsOrder.findIndex(
        //         (section) => section.section_id === over.id,
        //     );

        //     if (oldIndex !== -1 && newIndex !== -1) {
        //         const updatedSectionsOrder = arrayMove(
        //             sectionsOrder,
        //             oldIndex,
        //             newIndex,
        //         );

        //         const updatedSectionsWithOrder = updatedSectionsOrder.map(
        //             (section, index) => ({
        //                 ...section,
        //                 section_order: index + 1,
        //             }),
        //         );

        //         setSectionsOrder(updatedSectionsWithOrder);
        //         console.log(
        //             'Sections reordered locally:',
        //             updatedSectionsWithOrder,
        //         );
        //     }
        // }
        if (active.id !== over?.id) {
            const oldIndex = sectionsOrder?.findIndex(
                (item) => item.section_id === active.id,
            );
            const newIndex = sectionsOrder?.findIndex(
                (item) => item.section_id === over?.id,
            );
            const newOrder: Section[] | [] = arrayMove(
                sectionsOrder || [],
                oldIndex || 0,
                newIndex || 0,
            );
            setSectionsOrder(newOrder); // Update the state via prop
        }
    };

    // Handle save function to save section order.
    const handleSaveOrder = async () => {
        try {
            const updatedData = sectionsOrder?.map((section) => ({
                section_id: section.section_id,
                section_order: section.section_order,
            }));

            await updateSection(
                course_id,
                selectedSection?.section_id || '',
                updatedData,
            );
            console.log('Sections order saved to Firestore:', updatedData);
        } catch (error) {
            console.error('Error saving section order:', error);
        }
    };

    return (
        <div className='font-abhaya w-full bg-white'>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={sectionsOrder.map((section) => section.section_id)}
                    strategy={verticalListSortingStrategy}
                >
                    {sectionsOrder.map((section, index) => (
                        <SortableCourseSection
                            key={section.section_id}
                            section={section}
                            index={index + 1}
                            canEdit={canEdit}
                            onDeleteSection={onDeleteSection}
                            onEditSectionTitle={onEditSectionTitle}
                            onAddLesson={onAddLesson}
                            onEditLesson={onEditLesson}
                            onDeleteLesson={onDeleteLesson}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default CourseContentView;
