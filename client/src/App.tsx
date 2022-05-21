import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';

// Pages
import Home from './pages/Home';
import AddEnquete from './pages/AddEnquete';
import Enquete from './pages/Enquete';

// Components
// import Header from './components/Header';
// import Footer from './components/Footer';

// Styles
import './styles/main.css';
import './styles/home.css';
import './styles/addEnquete.css';
import './styles/enquete.css';

const App:React.FC = () => (
    <Router>
        <main>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:filter" element={<Home />} />
                <Route path="/add" element={<AddEnquete />} />
                <Route path="/edit/:enquete_id" element={<AddEnquete />} />
                <Route path="/enquete/:id" element={<Enquete />} />
            </Routes>
        </main>
    </Router>
);

export default App;
