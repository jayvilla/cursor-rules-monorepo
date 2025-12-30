'use client';

import { useState, useEffect } from 'react';
import { getMe } from '../../../lib/api-client';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'member' | 'viewer';
  orgId: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const meResponse = await getMe();
        if (meResponse?.user) {
          setUser(meResponse.user);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-fg mb-2">Settings</h1>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-fg mb-2">Settings</h1>
          <p className="text-muted">Unable to load user information</p>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === 'admin';
  const isMember = user.role === 'member';
  const isViewer = user.role === 'viewer';

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-fg mb-2">Settings</h1>
        <p className="text-muted">
          {isAdmin
            ? 'Manage your account and organization settings'
            : isMember
            ? 'Manage your account settings'
            : 'View your account settings'}
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-fg mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted block mb-1">Email</label>
              <p className="text-fg">{user.email}</p>
            </div>
            {user.name && (
              <div>
                <label className="text-sm font-medium text-muted block mb-1">Name</label>
                <p className="text-fg">{user.name}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted block mb-1">Role</label>
              <div className="mt-1">
                <Badge variant="secondary" className="capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Admin-only settings */}
        {isAdmin && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-fg mb-4">Organization Settings</h2>
            <p className="text-muted">Organization management features coming soon</p>
          </Card>
        )}

        {/* Member (Auditor) settings */}
        {isMember && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-fg mb-4">Preferences</h2>
            <p className="text-muted">Additional settings coming soon</p>
          </Card>
        )}

        {/* Viewer (Member) settings - minimal */}
        {isViewer && (
          <Card className="p-6">
            <p className="text-muted text-sm">
              Limited settings available for your role. Contact an administrator for additional configuration options.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

