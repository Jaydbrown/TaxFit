import React, { useState } from 'react';
import { Bell, Check, AlertCircle } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useUpdateNotificationSettings } from '@/hooks/auth/use-auth';

export default function NotificationSettings() {
  const updateNotifications = useUpdateNotificationSettings();

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    expenseReminders: true,
    taxDeadlines: true,
    attorneyMessages: true,
    loanUpdates: false,
    marketingEmails: false,
  });

  const handleSave = async () => {
    try {
      await updateNotifications.mutateAsync(notifications);
    } catch (error: any) {
      // Error is handled by the mutation
      console.error('Failed to update notification settings:', error);
    }
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const channels = [
    { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive notifications via email' },
    { key: 'smsAlerts', label: 'SMS Alerts', description: 'Receive notifications via SMS' },
    { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications in browser' },
  ];

  const activities = [
    { key: 'expenseReminders', label: 'Expense Reminders', description: 'Reminders to log expenses' },
    { key: 'taxDeadlines', label: 'Tax Deadlines', description: 'Important tax filing deadlines' },
    { key: 'attorneyMessages', label: 'Attorney Messages', description: 'Messages from your attorney' },
    { key: 'loanUpdates', label: 'Loan Updates', description: 'Updates on your loan applications' },
    { key: 'marketingEmails', label: 'Marketing Emails', description: 'Product updates and offers' },
  ];

  return (
    <Card>
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-light text-gray-900 flex items-center gap-2">
          <Bell className="w-6 h-6 text-primary-600" />
          Notification Preferences
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Choose how you want to receive updates and alerts
        </p>
      </div>

      <div className="space-y-6">
        {/* Channels */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Channels</h3>
          <div className="space-y-3">
            {channels.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{item.label}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <Input
                    type="checkbox"
                    checked={notifications[item.key as keyof typeof notifications]}
                    onChange={() => toggleNotification(item.key as keyof typeof notifications)}
                    className="sr-only peer"
                    disabled={updateNotifications.isPending}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Activity</h3>
          <div className="space-y-3">
            {activities.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{item.label}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <Input
                    type="checkbox"
                    checked={notifications[item.key as keyof typeof notifications]}
                    onChange={() => toggleNotification(item.key as keyof typeof notifications)}
                    className="sr-only peer"
                    disabled={updateNotifications.isPending}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {updateNotifications.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                {(updateNotifications.error as any)?.response?.data?.message || 
                 'Failed to update notification settings. Please try again.'}
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {updateNotifications.isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                Notification settings updated successfully!
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button 
            onClick={handleSave}
            disabled={updateNotifications.isPending}
          >
            {updateNotifications.isPending ? 'Saving...' : 'Save Notification Settings'}
          </Button>
        </div>
      </div>
    </Card>
  );
}