import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "../components/ui/avatar"

export function ProfileDropdown() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { isAdmin } = useAdmin();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleAdminDashboard = () => {
    navigate('/admin');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  if (!user) return null;

  return (
    <DropdownMenuContent className="w-56 bg-gray-900 text-white border-gray-800">
      <div className="flex items-center justify-start gap-2 p-2">
        <Avatar className="h-9 w-9 bg-gray-800">
          <AvatarFallback className="text-white">
            {profile?.full_name ? getInitials(profile.full_name) : <User className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{profile?.full_name || 'User'}</p>
          <p className="text-xs leading-none text-gray-400">{user.email}</p>
        </div>
      </div>
      <DropdownMenuSeparator className="bg-gray-800" />
      {isAdmin && (
        <DropdownMenuItem 
          onClick={handleAdminDashboard}
          className="text-white focus:bg-gray-800 focus:text-white"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Admin Dashboard</span>
        </DropdownMenuItem>
      )}
      <DropdownMenuItem 
        onClick={handleLogout}
        className="text-white focus:bg-gray-800 focus:text-white"
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
