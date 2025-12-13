import React, { useState } from 'react';
import { Lock, Shield, Eye, EyeOff, Check, Trash2, AlertCircle } from 'lucide-react';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { 
  useChangePassword, 
  useUpdateSecuritySettings, 
  useDeleteAccount 
} from '@/hooks/auth/use-auth';

export default function SecuritySettings() {
  const changePassword = useChangePassword();
  const updateSecurity = useUpdateSecuritySettings();
  const deleteAccount = useDeleteAccount();

  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Password validation
  const validatePassword = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[@$!%*?&#]/.test(password),
    };

    return {
      isValid: Object.values(requirements).every(Boolean),
      requirements,
    };
  };

  const passwordValidation = validatePassword(passwords.new);

  const handlePasswordChange = async () => {
    // Validation
    if (!passwords.current) {
      alert('Please enter your current password');
      return;
    }

    if (!passwords.new) {
      alert('Please enter a new password');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match');
      return;
    }

    if (!passwordValidation.isValid) {
      alert('Password does not meet requirements');
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword: passwords.current,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm,
      });

      alert('Password updated successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update password';
      alert(errorMessage);
    }
  };

  const handleSecuritySave = async () => {
    try {
      await updateSecurity.mutateAsync({
        twoFactorEnabled,
        loginAlerts,
        sessionTimeout: parseInt(sessionTimeout),
      });

      alert('Security settings updated successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update security settings';
      alert(errorMessage);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      alert('Please enter your password to confirm account deletion');
      return;
    }

    try {
      await deleteAccount.mutateAsync(deletePassword);
      // User is automatically logged out and redirected by the hook
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete account';
      alert(errorMessage);
      setDeletePassword('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card>
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-2xl font-light text-gray-900 flex items-center gap-2">
            <Lock className="w-6 h-6 text-primary-600" />
            Password & Authentication
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your password and authentication methods
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Current Password"
              type={showPassword ? 'text' : 'password'}
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              placeholder="Enter current password"
              leftIcon={<Lock className="w-4 h-4" />}
              disabled={changePassword.isPending}
            />
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              placeholder="Enter new password"
              leftIcon={<Lock className="w-4 h-4" />}
              disabled={changePassword.isPending}
            />
            <Input
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              placeholder="Confirm new password"
              leftIcon={<Lock className="w-4 h-4" />}
              disabled={changePassword.isPending}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            disabled={changePassword.isPending}
          >
            {showPassword ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide passwords
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show passwords
              </>
            )}
          </button>

          {/* Password Requirements */}
          {passwords.new && (
            <div className={`border rounded-lg p-4 ${
              passwordValidation.isValid 
                ? 'bg-green-50 border-green-200' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <h4 className={`font-medium mb-2 ${
                passwordValidation.isValid ? 'text-green-900' : 'text-blue-900'
              }`}>
                Password Requirements:
              </h4>
              <ul className="space-y-1 text-sm">
                <li className={`flex items-center gap-2 ${
                  passwordValidation.requirements.minLength 
                    ? 'text-green-700' 
                    : 'text-gray-600'
                }`}>
                  <Check className={`w-4 h-4 ${
                    passwordValidation.requirements.minLength 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                  }`} />
                  At least 8 characters
                </li>
                <li className={`flex items-center gap-2 ${
                  passwordValidation.requirements.hasUppercase 
                    ? 'text-green-700' 
                    : 'text-gray-600'
                }`}>
                  <Check className={`w-4 h-4 ${
                    passwordValidation.requirements.hasUppercase 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                  }`} />
                  One uppercase letter
                </li>
                <li className={`flex items-center gap-2 ${
                  passwordValidation.requirements.hasLowercase 
                    ? 'text-green-700' 
                    : 'text-gray-600'
                }`}>
                  <Check className={`w-4 h-4 ${
                    passwordValidation.requirements.hasLowercase 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                  }`} />
                  One lowercase letter
                </li>
                <li className={`flex items-center gap-2 ${
                  passwordValidation.requirements.hasNumber 
                    ? 'text-green-700' 
                    : 'text-gray-600'
                }`}>
                  <Check className={`w-4 h-4 ${
                    passwordValidation.requirements.hasNumber 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                  }`} />
                  One number
                </li>
                <li className={`flex items-center gap-2 ${
                  passwordValidation.requirements.hasSpecial 
                    ? 'text-green-700' 
                    : 'text-gray-600'
                }`}>
                  <Check className={`w-4 h-4 ${
                    passwordValidation.requirements.hasSpecial 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                  }`} />
                  One special character (@$!%*?&#)
                </li>
              </ul>
            </div>
          )}

          {changePassword.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  {(changePassword.error as any)?.response?.data?.message || 
                   'Failed to update password. Please try again.'}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={handlePasswordChange}
              disabled={changePassword.isPending || !passwordValidation.isValid}
            >
              {changePassword.isPending ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card>
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-2xl font-light text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary-600" />
            Security Settings
          </h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600 mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <Input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="sr-only peer"
                disabled={updateSecurity.isPending}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <h3 className="font-medium text-gray-900">Login Alerts</h3>
              <p className="text-sm text-gray-600 mt-1">
                Get notified of new login attempts
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <Input
                type="checkbox"
                checked={loginAlerts}
                onChange={(e) => setLoginAlerts(e.target.checked)}
                className="sr-only peer"
                disabled={updateSecurity.isPending}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
            </label>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Session Timeout</h3>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={updateSecurity.isPending}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          {updateSecurity.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  {(updateSecurity.error as any)?.response?.data?.message || 
                   'Failed to update security settings. Please try again.'}
                </div>
              </div>
            </div>
          )}

          {updateSecurity.isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-800">
                  Security settings updated successfully!
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={handleSecuritySave}
              disabled={updateSecurity.isPending}
            >
              {updateSecurity.isPending ? 'Saving...' : 'Save Security Settings'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card>
        <div className="border-b border-red-200 pb-4 mb-6">
          <h2 className="text-2xl font-light text-red-900 flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-red-600" />
            Danger Zone
          </h2>
        </div>

        <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
          <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
          <p className="text-sm text-red-700 mb-4">
            Once you delete your account, there is no going back. This action cannot be undone.
            All your data including expenses, loans, and documents will be permanently deleted.
          </p>
          <Button
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete My Account
          </Button>
        </div>
      </Card>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone. Please enter your password to confirm.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <Input
                label="Password"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password"
                leftIcon={<Lock className="w-4 h-4" />}
                disabled={deleteAccount.isPending}
              />
            </div>

            {deleteAccount.isError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800">
                    {(deleteAccount.error as any)?.response?.data?.message || 
                     'Failed to delete account. Please check your password.'}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                }}
                disabled={deleteAccount.isPending}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={deleteAccount.isPending || !deletePassword}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {deleteAccount.isPending ? 'Deleting...' : 'Delete Account'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}