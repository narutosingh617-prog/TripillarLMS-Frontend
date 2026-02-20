import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Mail, Lock, CheckCircle, GraduationCap, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Get temp token from sessionStorage
  const tempToken = sessionStorage.getItem('tempToken');
  const userEmail = sessionStorage.getItem('userEmail');

  useEffect(() => {
    if (!tempToken) {
      navigate('/login');
    }
  }, [tempToken, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input
    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);

    // Focus last filled input or first empty
    const lastFilledIndex = pastedData.length - 1;
    if (lastFilledIndex < 6) {
      inputRefs.current[Math.min(lastFilledIndex + 1, 5)].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const verificationCode = otp.join('');

    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        { verificationCode },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        }
      );

      if (response.data.token) {
        // Save token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Clear temp data
        sessionStorage.removeItem('tempToken');
        sessionStorage.removeItem('userEmail');
        
        setSuccess(true);
        
        // Redirect based on role
        setTimeout(() => {
          switch (response.data.user.role) {
            case 'superadmin':
              navigate('/dashboard');
              break;
            case 'teacher':
              navigate('/dashboard');
              break;
            case 'student':
              navigate('/dashboard');
              break;
            default:
              navigate('/login');
          }
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/resend-otp`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        }
      );
      
      // Reset OTP fields
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleBackToLogin = () => {
    sessionStorage.removeItem('tempToken');
    sessionStorage.removeItem('userEmail');
    navigate('/login');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Verification Successful!</CardTitle>
              <CardDescription className="mt-2">
                Redirecting to your dashboard...
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
            <CardDescription className="mt-2">
              Enter the 6-digit code sent to your email
            </CardDescription>
            <p className="text-sm text-gray-500 mt-2">{userEmail}</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg font-bold"
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>

            <div className="flex flex-col gap-3 text-center">
              <Button
                type="button"
                variant="link"
                onClick={handleResend}
                disabled={resending}
                className="text-blue-600"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${resending ? 'animate-spin' : ''}`} />
                {resending ? 'Sending...' : 'Resend Code'}
              </Button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
