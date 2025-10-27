'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout, loading } = useAuth();

  const publicLinks = [
    { href: '/', label: 'Home' },
  ];

  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
  
  const privateLinks = [
    { href: '/user/dashboard', label: 'Dashboard' },
    { href: '/lessons', label: 'Lessons' },
    { href: '/quiz', label: 'Quiz' },
    { href: '/profile', label: 'Profile' },
  ];
  
  const adminLinks = [
    { href: '/admin/dashboard', label: 'Admin Dashboard' },
    { href: '/lessons', label: 'Lessons' },
    { href: '/quiz', label: 'Quiz' },
    { href: '/admin/lessons', label: 'Manage Lessons' },
    { href: '/admin/quizzes', label: 'Manage Quizzes' },
    { href: '/profile', label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    localStorage.removeItem('userRole');
    router.push('/');
  };

  const links = isAuthenticated 
    ? (userRole === 'admin' ? adminLinks : privateLinks) 
    : publicLinks;

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-green-400" />
            <span className="font-bold text-xl text-white">CyberSecure</span>
          </Link>

          <div className="flex items-center space-x-6">
            <div className="flex space-x-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-green-400',
                    pathname === link.href
                      ? 'text-green-400 border-b-2 border-green-400'
                      : 'text-slate-300'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            {loading ? (
              <div className="w-20 h-8 bg-slate-700 animate-pulse rounded"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-slate-300">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user?.name || user?.email}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-green-400 hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-green-400 hover:bg-slate-800">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="bg-green-400 hover:bg-green-500 text-slate-900 font-semibold">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
