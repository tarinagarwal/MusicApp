import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Upload, ArrowLeft } from 'lucide-react';
import type { SongUpload } from '../../types/database';
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist is required"),
  album: z.string().min(1, "Album is required"),
  duration: z.number().min(0, "Duration must be a positive number"),
  song_file: z.instanceof(File).refine((file) => file.size > 0, "Song file is required"),
  cover_file: z.instanceof(File).refine((file) => file.size > 0, "Cover image is required"),
})

export default function AddSong() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      artist: "",
      album: "",
      duration: 0,
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'song_file' | 'cover_file') => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue(field, file);

      if (field === 'song_file') {
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);
        audio.onloadedmetadata = () => {
          form.setValue('duration', Math.round(audio.duration));
        };
      }
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Upload song file
      const songPath = `songs/${Date.now()}-${data.song_file.name}`;
      const { error: songError } = await supabase.storage
        .from('songs')
        .upload(songPath, data.song_file);
      if (songError) throw songError;

      // Upload cover image
      const coverPath = `covers/${Date.now()}-${data.cover_file.name}`;
      const { error: coverError } = await supabase.storage
        .from('covers')
        .upload(coverPath, data.cover_file);
      if (coverError) throw coverError;

      // Get public URLs
      const songUrl = supabase.storage.from('songs').getPublicUrl(songPath).data.publicUrl;
      const coverUrl = supabase.storage.from('covers').getPublicUrl(coverPath).data.publicUrl;

      // Create song record
      const { error: dbError } = await supabase.from('songs').insert({
        title: data.title,
        artist: data.artist,
        album: data.album,
        duration: data.duration,
        song_url: songUrl,
        cover_url: coverUrl,
      });

      if (dbError) throw dbError;
      navigate('/admin');
    } catch (error) {
      console.error('Error uploading song:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto bg-gray-900/40 border-gray-800">
      <CardHeader>
        <Button
          variant="ghost"
          onClick={() => navigate('/admin')}
          className="flex items-center space-x-2 text-gray-400 hover:bg-transparent hover:text-white mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Button>
        <CardTitle className="text-2xl font-bold text-white">Add New Song</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Title</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-gray-800 text-white border-gray-700" />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Artist</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-gray-800 text-white border-gray-700" />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="album"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Album</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-gray-800 text-white border-gray-700" />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Duration (seconds)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-gray-800 text-white border-gray-700" />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel className="text-gray-300">Song File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileChange(e, 'song_file')}
                  className="bg-gray-800 text-white border-gray-700"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
            <FormItem>
              <FormLabel className="text-gray-300">Cover Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'cover_file')}
                  className="bg-gray-800 text-white border-gray-700"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-black"
            >
              <Upload className="mr-2 h-4 w-4" />
              {loading ? 'Uploading...' : 'Upload Song'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

