import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { LogIn, Moon, Sun } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 transition-colors duration-500">
      <div className="max-w-md w-full bg-background rounded-2xl shadow-xl border border-muted p-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <button 
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-muted rounded-xl transition-all"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-primary rounded flex items-center justify-center mb-4 text-primary-foreground font-bold text-xl shadow-sm">
            SL
          </div>
          <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-6 border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-70"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={18} className="mr-2" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
