import {Dispatch, SetStateAction} from 'react';

import {Lesson} from './lesson';
//import {UserProfile} from './profile';
import {Section} from './section';
import {UserRole} from './user';

// 1. Types
// Used for UI/display purposes
// Determines what view/interface to show to the user.
// Different from UserRole (determines permissions)
export type ViewMode = 'student' | 'instructor';

// 2. Modal Props & State
// Basic props that all modal components share
export interface CommonModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Manages state for modals (open/close, what's being edited/deleted)
export interface ModalState {
    isModalOpen: boolean;
    isDeleteModalOpen: boolean;
    isEditTitleModalOpen: boolean;
    selectedLesson: Lesson | null;
    lessonToDelete: string | null;
    modalType: 'add' | 'edit';
}

// 3. Handler Interfaces
// Define common handlers for lesson and section operations.
// Used across multiple components that need to manipulate lessons/sections.
export interface BaseLessonHandlers {
    onAddLesson: (sectionId: string, lesson: Omit<Lesson, 'lesson_id'>) => void;
    onEditLesson: (
        sectionId: string,
        lessonId: string,
        updatedLesson: Partial<Lesson>,
    ) => void;
    onDeleteLesson: (sectionId: string, lessonId: string) => void;
}

export interface BaseSectionHandlers {
    onDeleteSection: (sectionId: string) => void;
    onEditSectionTitle: (sectionId: string, newTitle: string) => void;
}

// Combines both handlers plus section state management.
export interface ContentHandlers
    extends BaseLessonHandlers,
        BaseSectionHandlers {
    setCourseSections: Dispatch<SetStateAction<Section[]>>;
}

// 4. User Related
// Minimal user properties needed.
// export interface BaseUser {
//     uid: string;
//     email: string;
//     role: UserRole;
// }

// Used for components that can be edited based on permissions.
export interface EditableProps {
    canEdit: boolean;
    //userType: ViewMode;
}

// // Global application state for current user.
// export interface AppUserState {
//     currentUserId: string;
//     userType: ViewMode;
//     currentRole: UserRole;
//     isLoading: boolean;
//     error: string | null;
//     isAuthenticated: boolean;
//     userData: UserProfile | null;
// }
