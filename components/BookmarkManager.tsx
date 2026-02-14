'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
}

export default function BookmarkManager({ userId }: { userId: string }) {

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setBookmarks(data)
    }
  }

  // Add bookmark
  const addBookmark = async () => {
    if (!title || !url) return

    await supabase.from('bookmarks').insert([
      {
        title,
        url,
        user_id: userId,
      },
    ])

    setTitle('')
    setUrl('')
  }

  // Delete bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id)
  }


useEffect(() => {
  if (!userId) return

  fetchBookmarks()

  const channel = supabase
    .channel('bookmarks-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookmarks',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('Change received!', payload)
        fetchBookmarks() // safest & consistent
      }
    )
    .subscribe((status) => {
      console.log('REALTIME STATUS:', status)
    })

  return () => {
    supabase.removeChannel(channel)
  }
}, [userId])



  return (
  <div>

    {/* Add Bookmark Card */}
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4">Add New Bookmark</h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 
                     focus:outline-none focus:ring-2 focus:ring-black transition"
        />

        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 
                     focus:outline-none focus:ring-2 focus:ring-black transition"
        />

        <button
          onClick={addBookmark}
          className="bg-black text-white px-6 py-2 rounded-xl 
                     hover:scale-105 transition-transform"
        >
          Add
        </button>
      </div>
    </div>

    {/* Bookmark List */}
    <div className="space-y-4">
      {bookmarks.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          No bookmarks yet. Add your first one ✨
        </div>
      )}

      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="bg-white shadow-md rounded-2xl p-5 
                     flex items-center justify-between 
                     hover:shadow-lg transition"
        >
          <a
            href={bookmark.url}
            target="_blank"
            className="text-gray-800 font-medium hover:underline"
          >
            {bookmark.title}
          </a>

          <button
            onClick={() => deleteBookmark(bookmark.id)}
            className="text-sm text-red-500 hover:text-red-600 transition"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  </div>
)
}
