import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ListPage from '../pages/ListPage';
import AddPage from '../pages/AddPage';
import DtlPage from '../pages/DtlPage';
import Layout from '../components/layout/Layout';
import MeetingDtlPage from '../pages/MeetingDtlPage';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/list" element={<ListPage />} />
                    <Route path="/add" element={<AddPage />} />
                    <Route path="/dtl/:id" element={<DtlPage />} />
                    <Route path="/meetingDtl/:id" element={<MeetingDtlPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
