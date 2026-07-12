import './globals.css';
import Sidebar from '@/components/sidebar';
import RouteGuard from '@/components/RouteGuard';

export const metadata = {
  title: 'TransitOps Platform',
  description: 'Smart Transport Operations Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen text-slate-900">
        <RouteGuard>
          <div className="flex min-h-screen">
            {/* The sidebar will dynamically show links based on the role */}
            <Sidebar />
            
            <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
              {children}
            </main>
          </div>
        </RouteGuard>
      </body>
    </html>
  );
}