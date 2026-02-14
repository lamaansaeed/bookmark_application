'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import LoginButton from '../components/LoginButton'
import BookmarkManager from '../components/BookmarkManager'

export default function Home() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-4">
          Smart Bookmark
        </h1>
        <p className="text-gray-500 mb-6">
          Save and manage your favorite links in one place.
        </p>
        <LoginButton />
      </div>
    </div>
  )
}


 return (
  <div className="min-h-screen bg-gray-50 px-6 py-10">
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Smart Bookmark
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Organize your web beautifully.
          </p>
        </div>

        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm font-medium text-gray-600 hover:text-black transition"
        >
          Logout
        </button>
      </div>

      <BookmarkManager userId={user.id} />
    </div>
  </div>
)
}







