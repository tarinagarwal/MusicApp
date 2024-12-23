import React from 'react';
import { Link } from 'react-router-dom';
import { User, Music } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from "../components/ui/button"
import { ProfileDropdown } from './ProfileDropdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

export function Header() {
  const { user, profile } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <Link to="/" className="flex items-center gap-2 text-white">
        <Music size={24} />
        <span className="text-xl font-bold hidden sm:inline">Spotify Clone</span>
      </Link>

      <div className="relative">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 rounded-full bg-gray-800 p-0">
                {profile?.full_name ? (
                  <span className="text-sm font-medium text-white">
                    {getInitials(profile.full_name)}
                  </span>
                ) : (
                  <User size={16} className="text-white" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <ProfileDropdown />
          </DropdownMenu>
        ) : (
          <Link to="/auth">
            <Button variant="secondary" size="sm" className="bg-gray-800 hover:bg-gray-700 text-white">
              Sign Up
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
