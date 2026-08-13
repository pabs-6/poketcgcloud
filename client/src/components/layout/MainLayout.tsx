import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export function MainLayout() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      <div className="mx-auto flex w-full max-w-[1600px] gap-8 px-4 py-8 lg:px-8">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
