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
  Haven't done yet.
  ```

### 2. Course Model
The Course model defines the structure for courses, including sections that contain lessons as documents (URLs), YouTube videos, or quizzes with one or more questions.

```bash
  Haven't done yet.
  ```
##
_**If you have any questions or run into issues, please open an issue in the repository or reach out to the project maintainers for assistance.**_
##
## Reference System
- Inspired by the Udemy and Medium.
