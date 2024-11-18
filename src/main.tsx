import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App';
// Importing the Provider component to connect Redux store with the React app
import {Provider} from 'react-redux';
// Importing the Redux store
import {store} from './store/store';
// Importing BrowserRouter for routing functionality in React
import {BrowserRouter} from 'react-router-dom';

// Type assertion to inform TypeScript that 'root' is an HTMLElement
const rootElement = document.getElementById('root') as HTMLElement;
// The createRoot function needs to target the 'root' div and render the app inside it
const root = createRoot(rootElement);

// Rendering the app within the root element, wrapped by the Redux Provider and BrowserRouter components
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
);
