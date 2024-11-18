import {createRoot} from 'react-dom/client'; // Importing the createRoot method from react-dom/client
import './index.css'; // Importing the CSS styles for the entire app
import App from './App'; // Importing the main App component (without JSX extension, as it's a TSX file now)
import {Provider} from 'react-redux'; // Importing the Provider component to connect Redux store with the React app
import {store} from './store/store'; // Importing the Redux store (no need for .js extension, as TypeScript will infer this)
import {BrowserRouter} from 'react-router-dom'; // Importing BrowserRouter for routing functionality in React

// The createRoot function needs to target the 'root' div and render the app inside it
const rootElement = document.getElementById('root') as HTMLElement; // Type assertion to inform TypeScript that 'root' is an HTMLElement
const root = createRoot(rootElement); // Creating a root element using ReactDOM's createRoot method

// Rendering the app within the root element, wrapped by the Redux Provider and BrowserRouter components
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
);
