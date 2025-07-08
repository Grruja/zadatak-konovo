import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
        <Button onClick={logout}>Logout</Button>
      </header>
      <main>
        <p>This is your dashboard. More content will be added here soon.</p>
      </main>
    </div>
  );
} 