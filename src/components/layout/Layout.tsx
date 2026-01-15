import { Outlet } from 'react-router-dom';
import '../../app/App.css'; // Global styles

export default function Layout() {
    return (
        <div className="app">
            <Outlet />
            <footer className="footer">
                <p>Copyright © 2024 Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
}
