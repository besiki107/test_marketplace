import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (login(username, password)) {
      toast.success('Login successful');
      navigate('/admin');
    } else {
      setError('Invalid username or password');
      toast.error('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <div className="border border-border bg-card p-8">
          <h1 className="font-mono text-2xl font-bold tracking-tight uppercase mb-6" data-testid="login-title">
            Admin Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="font-mono text-xs uppercase tracking-wider">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                data-testid="username-input"
              />
            </div>

            <div>
              <Label htmlFor="password" className="font-mono text-xs uppercase tracking-wider">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="password-input"
              />
            </div>

            {error && (
              <p className="text-destructive text-sm font-mono" data-testid="login-error">{error}</p>
            )}

            <Button type="submit" className="w-full" data-testid="login-submit-button">
              Login
            </Button>
          </form>
        </div>

        <div className="mt-4 text-center">
          <p className="font-sans text-sm text-muted-foreground">
            Demo credentials: admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;