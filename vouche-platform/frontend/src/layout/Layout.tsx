import { Outlet } from 'react-router-dom';
import Navbar from '@/layout/Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ ส่วน Navbar อยู่บนสุด */}
      <Navbar />

      {/* ✅ Outlet จะเป็นส่วนที่แสดงเนื้อหาแต่ละหน้า */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
