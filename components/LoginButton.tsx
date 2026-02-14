'use client'

import { supabase } from '../lib/supabaseClient'

export default function LoginButton() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  return (
   <button
  onClick={handleLogin}
  className="w-full bg-black text-white py-3 rounded-xl font-medium 
             hover:scale-[1.02] transition-transform duration-200"
>
  Sign in with Google
</button>
  )
}
