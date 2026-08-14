import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 gap-4 px-3 py-4 sm:gap-6 sm:px-4 sm:py-6 lg:gap-8 lg:px-8 lg:py-8 pb-24 lg:pb-8">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
