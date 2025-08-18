// ===========================
// MAIN APP COMPONENT
// ===========================

import { RouterProvider } from 'react-router-dom';
import router from './Router/Router';
import './Styles/MAIN.scss';

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;