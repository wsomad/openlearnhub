# OpenLearnHub.

OpenLearnHub is an e-learning platform with features like lessons in documents, videos, and quizzes, and allows users to become instructors to create and share courses.


## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind-CSS, React-Redux

- **Backend & Services:** Firebase

- **DevOps & Tools:** Docker, Podman, GitHub

## Scope

- **Student:** Access courses with lessons that are ready to publish.

- **Instructor:** Create, edit, or delete courses as drafts or publish them when ready.

## Key Features
- **Course Enrollment and Learning:** Students can enroll in published courses and access lessons in the form of documents, videos, and quizzes.

- **Course Creation and Management:** Instructors can create and update courses, reorder sections using drag-and-drop, and perform CRUD operations on sections and lessons (documents, videos, or quizzes).

- **Profile Customization:** Students and instructors can update their profiles in their respective profile pages.

## Project Setup
### 1. Prerequisites
- [Node.js](https://nodejs.org/en) (v18 or higher)
- [npm](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager) (v9 or higher)
- [Docker](https://www.docker.com/)
- [Podman](https://podman.io/)

### 2. Installation
### Steps
**1. Clone the Repository**
   - Open your terminal and run the following command to clone the repository:
     ```bash
     git clone https://github.com/wsomad/openlearnhub.git
     ```
   - Move into the project directory:
     ```bash
     cd openlearnhub
     ```

**2. Install Dependencies**
   - Install all the required packages using npm:
     ```bash
     npm install
     ```

**3. Set Up Environment Variables**
   - Create a .env.local file in the root of the project and add your Firebase configuration:
     ```env
     VITE_FIREBASE_API_KEY=your-api-key
     VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
     VITE_APP_FIREBASE_PROJECT_ID=your-project-id
     VITE_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     VITE_FIREBASE_APP_ID=your-app-id
     ```
   - Replace the placeholders `your-api-key`, `your-auth-domain`, etc) with your Firebase project's actual credentials.

**4. Initialize Firebase Client**
   - Ensure you have a `src/firebaseClient.js` file with the following content to initialize Firebase services:
     ```javascript
     // Import all functions needed
     import { initializeApp } from 'firebase/app';
     import { getAuth } from 'firebase/auth';
     import { getFirestore } from 'firebase/firestore';
     import { getStorage } from 'firebase/storage';
     
     // Firebase configuration
     const firebaseConfig = {
         apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
         authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
         projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
         storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET
         messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
         appId: import.meta.env.VITE_FIREBASE_APP_ID,
         };
         
     // Initialize Firebase
     const app = initializeApp(firebaseConfig);
     export const auth = getAuth(app);
     export const db = getFirestore(app);
     export const storage = getStorage(app);
     ```

**5. Run the Development Server**
   - Start your development server:
     ```bash
     npm run dev
     ```
   - Open your browser and navigate to `http://localhost:5173` to view your app.

**6. Running with Podman**
   - Start by pulling the image:
     ```bash
     podman pull haikalsamari/openlearnhub
     ```
- Run the container:
     ```bash
     podman run -d -p 8080:80 haikalsamari/openlearnhub
     ```
- Go to `localhost:8080` to view the app.

## Data Model
### 1. User Model (Student & Instructor)
The User model defines the structure for both students and instructors, created or updated by users.

```bash
  {
  uid: "abc123",
  email: "john.doe@gmail.com",
  username: "johndoe",
  firstname: "John",
  lastname: "Doe",
  profile_image: "https://api.dicebear.com/9.x/dylan/svg?seed=kwm91q0ds2",
  created_at: new Date("2024-01-15"),
  updated_at: new Date("2024-03-10"),
  student: {
    courses_enrolled: ["course101", "course102", "course103"],
    education_level: "Undergraduate"
  },
  instructor: {
    total_courses_created: 5,
    rating: 4,
    years_of_experience: 8,
    specialization_area: ["Mobile Development"],
    profile_summary: "Experienced software engineer with expertise in full-stack development",
    social_links: {
      github: "https://github.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe"
    },
    hasRegister: true
  }
}
  ```

### 2. Course Model
The Course model defines the structure for courses, including sections that contain lessons as documents (URLs), YouTube videos, or quizzes with one or more questions.

```bash
{
  course_id: "course123",
  course_title: "Complete Web Development Bootcamp",
  course_description: "Learn modern web development from scratch to advanced",
  course_instructor: "John Doe",
  course_pricing: 0,
  course_type: "Mobile Development",
  course_thumbnail_url: "https://img.freepik.com/premium-psd/school-education-admission-youtube-thumbnail-web-banner-template_475351-411.jpg",
  course_requirements: [
    "Basic understanding of HTML & CSS",
    "JavaScript fundamentals",
    "A computer with internet connection"
  ],
  ready_for_publish: true,
  course_created_at: new Date("2024-01-15"),
  course_updated_at: new Date("2024-03-10"),
  course_enrollment_number: 20,
  course_number_of_section: 3,
  instructor_id: "johndoe",
  sections: {
    "section1": {
      section_id: "section1",
      section_order: 1,
      section_title: "Getting Started with Web Development",
      course_id: "course123",
      lessons: {
        "lesson1": {
          lesson_id: "lesson1",
          lesson_order: 1,
          lesson_title: "Introduction to HTML",
          lesson_type: "video",
          section_id: "section1",
          video: {
            video_url: "https://example.com/videos/intro-html",
            video_duration: "15:30"
          }
        },
        "lesson2": {
          lesson_id: "lesson2",
          lesson_order: 2,
          lesson_title: "HTML Cheat Sheet",
          lesson_type: "document",
          section_id: "section1",
          document: {
            document_url: "https://example.com/docs/html-cheatsheet.pdf"
          }
        },
        "lesson3": {
          lesson_id: "lesson3",
          lesson_order: 3,
          lesson_title: "HTML Basics Quiz",
          lesson_type: "quiz",
          section_id: "section1",
          quiz: {
            quiz_id: "quiz1",
            quiz_title: "HTML Fundamentals",
            quiz_number_of_questions: 2,
            questions: [
              {
                question_id: "q1",
                question_text: "What does HTML stand for?",
                question_order: 1,
                question_options: [
                  "Hyper Text Markup Language",
                  "High Tech Modern Language",
                  "Hyper Transfer Markup Language",
                  "None of the above"
                ],
                question_correct_answer_index: 0,
                question_answer_explanation: "HTML stands for Hyper Text Markup Language"
              },
              {
                question_id: "q2",
                question_text: "Which tag is used for creating a paragraph?",
                question_order: 2,
                question_options: [
                  "<paragraph>",
                  "<p>",
                  "<para>",
                  "<text>"
                ],
                question_correct_answer_index: 1,
                question_answer_explanation: "The <p> tag is used to define a paragraph in HTML"
              }
            ]
          }
        }
      }
    },
    "section2": {
      section_id: "section2",
      section_order: 2,
      section_title: "CSS Fundamentals",
      course_id: "course123",
      lessons: {
        "lesson4": {
          lesson_id: "lesson4",
          lesson_order: 1,
          lesson_title: "Introduction to CSS",
          lesson_type: "video",
          section_id: "section2",
          video: {
            video_url: "https://example.com/videos/intro-css",
            video_duration: "20:15"
          }
        }
      }
    }
  }
}
  ```
##
_**If you have any questions or run into issues, please open an issue in the repository or reach out to the project maintainers for assistance.**_
##
## Reference System
- Inspired by the Udemy and Medium.
