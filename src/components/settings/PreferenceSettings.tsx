import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

export default function PreferencesSettings() {
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'WAT',
    currency: 'NGN',
    dateFormat: 'DD/MM/YYYY',
  });

  const handleSave = () => {
    // TODO: Integrate with backend
    alert('Preferences updated!');
  };

  return (
    <Card>
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-light text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary-600" />
          Application Preferences
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Customize your application experience
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={preferences.language}
            onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="ha">Hausa</option>
            <option value="ig">Igbo</option>
            <option value="yo">Yoruba</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={preferences.timezone}
            onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="WAT">WAT (West Africa Time)</option>
            <option value="GMT">GMT (Greenwich Mean Time)</option>
            <option value="EST">EST (Eastern Standard Time)</option>
            <option value="PST">PST (Pacific Standard Time)</option>
            <option value="CET">CET (Central European Time)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={preferences.currency}
            onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="NGN">NGN (₦) - Nigerian Naira</option>
            <option value="USD">USD ($) - US Dollar</option>
            <option value="EUR">EUR (€) - Euro</option>
            <option value="GBP">GBP (£) - British Pound</option>
            <option value="GHS">GHS (₵) - Ghanaian Cedi</option>
            <option value="KES">KES (KSh) - Kenyan Shilling</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Format
          </label>
          <select
            value={preferences.dateFormat}
            onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY (12/12/2025)</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY (12/12/2025)</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD (2025-12-12)</option>
            <option value="DD-MMM-YYYY">DD-MMM-YYYY (12-Dec-2025)</option>
          </select>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </div>
    </Card>
  );
}