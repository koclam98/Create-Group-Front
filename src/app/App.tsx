import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ListPage from '../pages/ListPage';
import AddPage from '../pages/AddPage';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/list" element={<ListPage />} />
                <Route path="/add" element={<AddPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
