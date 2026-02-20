import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { changePassword } from '../services/userService';
import { getCurrentUser } from '../services/authService';

export const ChangePasswordDialog = ({ open, onOpenChange, isFirstLogin = false }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    if (oldPassword === newPassword && !isFirstLogin) {
      setError('New password must be different from old password');
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(oldPassword, newPassword);
      toast.success('Password changed successfully!');
      
      // Update user in localStorage to reflect mustChangePassword = false
      const user = getCurrentUser();
      if (user) {
        localStorage.setItem('user', JSON.stringify({ ...user, mustChangePassword: false }));
      }
      
      // Reset form
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      onOpenChange(false);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to change password. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Don't allow closing if it's first login
    if (isFirstLogin) {
      return;
    }
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose} disableClose={isFirstLogin}>
      <DialogContent className="sm:max-w-md w-full m-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="size-5" />
            {isFirstLogin ? 'Change Your Password' : 'Change Password'}
          </DialogTitle>
          <DialogDescription>
            {isFirstLogin 
              ? 'You must change your password before accessing the system. Enter the password sent to your email as your current password.'
              : 'Enter your current password and choose a new password'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="old-password">
              {isFirstLogin ? 'Temporary Password (from email)' : 'Current Password'}
            </Label>
            <div className="relative">
              <Input
                id="old-password"
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder={isFirstLogin ? 'Enter password from email' : 'Enter current password'}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? (
                  <EyeOff className="size-4 text-gray-500" />
                ) : (
                  <Eye className="size-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 6 characters)"
                required
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="size-4 text-gray-500" />
                ) : (
                  <Eye className="size-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4 text-gray-500" />
                ) : (
                  <Eye className="size-4 text-gray-500" />
                )}
              </Button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-red-500">Passwords do not match</p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            {!isFirstLogin && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Changing...' : isFirstLogin ? 'Change Password to Continue' : 'Change Password'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
