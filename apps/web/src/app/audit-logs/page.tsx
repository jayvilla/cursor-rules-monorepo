import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getMeServer } from '../../lib/api-client';

export default async function AuditLogsPage() {
  // Server-side authentication check
  const cookieStore = await cookies();
  // Format cookies as a header string
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');
  const meResponse = await getMeServer(cookieHeader);

  if (!meResponse || !meResponse.user) {
    redirect('/login');
  }

  const user = meResponse.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Audit Logs</h1>
            <p className="text-slate-600">
              Welcome, {user.name || user.email}! You are successfully authenticated.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <p className="text-slate-500">
              Audit logs content will be displayed here. This page is protected and requires
              authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

