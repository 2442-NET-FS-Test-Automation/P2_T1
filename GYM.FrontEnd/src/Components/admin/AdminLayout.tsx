import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import '../../css/Admin.css';

export function AdminLayout() {
  return (
    <div className="d-flex gq-admin-body min-vh-100">
      <AdminSidebar />
      <div className="d-flex flex-column flex-grow-1 overflow-hidden">
        <AdminTopbar />
        <main className="p-4 flex-grow-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};