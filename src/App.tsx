import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { Header } from "./components/Header";
import Player from "./components/Player";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import LikedSongs from "./pages/LikedSongs";
import Auth from "./pages/Auth";
import AuthGuard from "./components/AuthGuard";
import AdminGuard from "./components/AdminGuard";
import AdminDashboard from "./pages/admin/Dashboard";
import AddSong from "./pages/admin/AddSong";

function App() {
  return (
    <Router>
      <div className="h-screen flex flex-col bg-black text-white">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-black">
            <div className="p-6">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route
                  path="/library"
                  element={
                    <AuthGuard>
                      <Library />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/liked"
                  element={
                    <AuthGuard>
                      <LikedSongs />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AuthGuard>
                      <AdminGuard>
                        <AdminDashboard />
                      </AdminGuard>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/admin/songs/new"
                  element={
                    <AuthGuard>
                      <AdminGuard>
                        <AddSong />
                      </AdminGuard>
                    </AuthGuard>
                  }
                />
              </Routes>
            </div>
          </main>
        </div>
        <Player />
      </div>
    </Router>
  );
}

export default App;
