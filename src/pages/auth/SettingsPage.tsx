import React, { useState } from 'react';
import { User, Shield, Bell, FileText } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import ProfileSettings from '@/components/settings/ProfileSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import PreferencesSettings from '@/components/settings/PreferenceSettings';

type TabId = 'profile' | 'security' | 'notifications' | 'preferences';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  const tabs = [
    { id: 'profile' as TabId, label: 'Profile', icon: User },
    { id: 'security' as TabId, label: 'Security', icon: Shield },
    { id: 'notifications' as TabId, label: 'Notifications', icon: Bell },
    { id: 'preferences' as TabId, label: 'Preferences', icon: FileText },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-extralight text-gray-900 mb-2">Settings</h1>
            <p className="text-lg text-gray-600 font-light">
              Manage your account preferences and security
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                            : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && <ProfileSettings />}
              {activeTab === 'security' && <SecuritySettings />}
              {activeTab === 'notifications' && <NotificationSettings />}
              {activeTab === 'preferences' && <PreferencesSettings />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}