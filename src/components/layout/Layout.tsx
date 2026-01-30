import { Outlet, useLocation } from 'react-router-dom';
import '../../app/App.css'; // Global styles

export default function Layout() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isScrollablePage =
        location.pathname === '/list' ||
        location.pathname.startsWith('/meetingDtl') ||
        location.pathname.startsWith('/grid') ||
        location.pathname === '/add' ||
        location.pathname.startsWith('/dtl');

    return (
        <div className={`app ${isScrollablePage ? 'scrollable-layout' : 'fixed-layout'}`}>
            <Outlet />
            {!isHomePage && (
                <footer className="footer">
                    <p>Copyright © 2026 Your Company. All rights reserved.</p>
                </footer>
            )}
        </div>
    );
}
