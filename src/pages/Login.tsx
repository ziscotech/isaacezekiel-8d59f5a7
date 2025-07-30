import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { apiService } from '../services/api';
import { useToast } from '../hooks/use-toast';
import loginHero from '../assets/login-hero.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiService.login({ email, password });
      toast({
        title: "Login successful",
        description: "Welcome to Lendsqr Admin!",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-4 xl:p-8">
        <div className="max-w-md w-full text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8 xl:mb-12">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-primary rounded-sm flex items-center justify-center mr-2">
              <span className="text-white font-bold text-sm md:text-lg">L</span>
            </div>
            <span className="text-xl md:text-2xl font-bold text-lendsqr-navy">lendsqr</span>
          </div>
          
          {/* Hero Image */}
          <img 
            src={loginHero} 
            alt="Lendsqr Admin Dashboard" 
            className="w-full max-w-xs lg:max-w-sm xl:max-w-md mx-auto mb-6 xl:mb-8"
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white min-h-screen lg:min-h-0">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center mb-8 sm:mb-10 md:mb-12 lg:hidden">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-sm flex items-center justify-center mr-2">
              <span className="text-white font-bold text-sm sm:text-lg">L</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-lendsqr-navy">lendsqr</span>
          </div>

          {/* Welcome Text */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-lendsqr-navy mb-2">Welcome!</h1>
            <p className="text-lendsqr-gray text-sm sm:text-base">Enter details to login.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="lendsqr-input text-sm sm:text-base"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="lendsqr-input pr-12 text-sm sm:text-base"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary text-xs sm:text-sm font-medium"
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>

            <div>
              <a href="#" className="text-primary text-xs sm:text-sm font-medium hover:underline">
                FORGOT PASSWORD?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full lendsqr-btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base py-3 sm:py-4"
            >
              {loading ? 'Logging in...' : 'LOG IN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;