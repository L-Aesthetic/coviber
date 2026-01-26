import { useAuth } from '../context/AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0f111a',
                color: 'var(--accent-primary)'
            }}>
                <Loader2 className="animate-spin" size={40} />
            </div>
        );
    }

    if (!user) {
        // Redirect to landing page, but save the intended location
        return <Navigate to="/landing" state={{ from: location }} replace />;
    }

    return children;
}
