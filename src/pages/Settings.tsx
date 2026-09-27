import { useAuth } from '../lib/AuthContext';
import { Link } from 'react-router-dom';

export function Settings() {
  const { organization } = useAuth();

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      <div className="grid gap-8">
        <section>
          <h2 className="text-lg font-semibold mb-4">Organization</h2>
          <div className="card">
            <div className="grid gap-4">
              <div>
                <span className="text-sm text-muted font-semibold block mb-1">Organization Name</span>
                <span>{organization?.name}</span>
              </div>
              <div>
                <span className="text-sm text-muted font-semibold block mb-1">Organization Code</span>
                <span>{organization?.code}</span>
              </div>
              <div>
                <span className="text-sm text-muted font-semibold block mb-1">Description</span>
                <span>{organization?.description || 'No description provided.'}</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>
          <div className="card flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Personal Information</h3>
              <p className="text-sm text-muted">Update your name, email, and contact details.</p>
            </div>
            <Link to="/profile" className="btn btn-outline">Edit Profile</Link>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Security</h2>
          <div className="card">
            <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <h3 className="font-semibold mb-1">Change Password</h3>
                <p className="text-sm text-muted">Update your account password.</p>
              </div>
              <button className="btn btn-outline" disabled>Update (Phase 2)</button>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div>
                <h3 className="font-semibold mb-1">Active Sessions</h3>
                <p className="text-sm text-muted">Manage your active devices and sessions.</p>
              </div>
              <button className="btn btn-outline" disabled>Manage (Phase 2)</button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Application</h2>
          <div className="card flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Theme Preferences</h3>
              <p className="text-sm text-muted">POLAR-IMS currently uses the default Light theme.</p>
            </div>
            <select className="form-input" style={{ width: 'auto' }} disabled>
              <option>Light Theme</option>
              <option>Dark Theme (Phase 2)</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  );
}
