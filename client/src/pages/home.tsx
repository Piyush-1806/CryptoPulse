import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function Home() {
  const [_, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to dashboard
    setLocation('/dashboard');
  }, [setLocation]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl text-white">Redirecting to Dashboard...</h1>
      </div>
    </div>
  );
}
