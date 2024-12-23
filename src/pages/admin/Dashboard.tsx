import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "../../components/ui/button"
import { SongList } from '../../components/admin/SongList';
import { Stats } from '../../components/admin/Stats';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <Link to="/admin/songs/new">
          <Button variant="default" className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-black">
            <Plus className="mr-2 h-4 w-4" />
            Add New Song
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Stats />
      </div>

      <Card className="bg-gray-900/40 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">All Songs</CardTitle>
        </CardHeader>
        <CardContent>
          <SongList />
        </CardContent>
      </Card>
    </div>
  );
}

