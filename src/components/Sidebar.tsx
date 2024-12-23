import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Library, Heart, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
    ...(user ? [{ name: 'Liked Songs', href: '/liked', icon: Heart }] : []),
  ];

  const NavContent = () => (
    <nav className="space-y-4">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center space-x-3 text-sm font-medium px-3 py-2 rounded-md',
              location.pathname === item.href
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white'
            )}
            onClick={() => setIsOpen(false)}
          >
            <Icon size={20} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-6 w-6 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 bg-black p-6">
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6 text-white" />
          </Button>
          <div className="mt-8">
            <NavContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-60 bg-black p-6 h-screen">
        <NavContent />
      </div>
    </>
  );
}
