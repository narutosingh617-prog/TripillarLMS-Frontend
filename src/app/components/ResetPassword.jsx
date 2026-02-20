import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Lock, CheckCircle, GraduationCap } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Basic token validation - in production, you might want to validate on mount
    if (!token) {
      setIsValidToken(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please enter both password fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        token,
        newPassword: password,
      });

      if (response.status === 200) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
          <div>
            <CardTitle className="text-xl sm:text-2xl">Invalid Link</CardTitle>
            <CardDescription className="mt-2 text-sm sm:text-base">
              This password reset link is invalid or has expired.
            </CardDescription>
          </div>
        </CardHeader>
          <CardContent>
            <Link to="/forgot-password" className="block">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Request New Link
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-xl sm:text-2xl">Password Reset Successful!</CardTitle>
            <CardDescription className="mt-2 text-sm sm:text-base">
              Your password has been reset. Redirecting to login...
            </CardDescription>
          </div>
        </CardHeader>
          <CardContent>
            <Link to="/login" className="block">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to Login
              </Button>
            </Link>
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
            <CardTitle className="text-xl sm:text-2xl">Reset Password</CardTitle>
            <CardDescription className="mt-2 text-sm sm:text-base">
              Enter your new password below.
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
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
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
