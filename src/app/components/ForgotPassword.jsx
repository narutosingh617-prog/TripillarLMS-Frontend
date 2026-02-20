import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Mail, Lock, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        email,
      });

      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-xl sm:text-2xl">Check Your Email</CardTitle>
            <CardDescription className="mt-2 text-sm sm:text-base">
              We've sent a password reset link to your email address.
            </CardDescription>
          </div>
        </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Please check your inbox and click the reset link. The link will expire in 15 minutes.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate('/login')} 
              className="w-full" 
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <GraduationCap className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl sm:text-2xl">Forgot Password</CardTitle>
            <CardDescription className="mt-2 text-sm sm:text-base">
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@ku.edu.np"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <div className="text-center">
              <Link 
                to="/login" 
                className="text-sm text-blue-600 hover:underline inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
