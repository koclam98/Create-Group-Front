import { Outlet, useLocation } from 'react-router-dom';
import '../../app/App.css'; // Global styles

export default function Layout() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div className="app">
            <Outlet />
            {!isHomePage && (
                <footer className="footer">
                    <p>Copyright © 2026 Your Company. All rights reserved.</p>
                </footer>
            )}
        </div>
    );
}
