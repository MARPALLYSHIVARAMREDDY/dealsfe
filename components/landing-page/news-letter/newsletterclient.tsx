'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Client Component - Only for email input interactivity
export default function NewsletterForm() {
  const [email, setEmail] = useState('')

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // TODO: When API is ready, dispatch Redux async action here
    // Example: dispatch(subscribeToNewsletterAsync({ email }))
    // The async action will call: POST /app/data/newsletter
    // Use Redux Thunk or Redux Toolkit createAsyncThunk

    // Future implementation structure:
    // const resultAction = await dispatch(subscribeToNewsletterAsync({ email }))
    // if (subscribeToNewsletterAsync.fulfilled.match(resultAction)) {
    //   // Success handling
    //   setEmail('')
    // } else {
    //   // Error handling
    // }

    console.log('Newsletter subscription:', email)

    // Clear email after submission
    setEmail('')
  }

  return (
    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 !h-11 sm:!h-12 md:!h-14 px-4 sm:px-5 md:px-6 rounded-full bg-white border-0 text-foreground placeholder:text-muted-foreground text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-foreground/20"
      />
      <Button
        type="submit"
        className="!h-11 sm:!h-12 md:!h-14 px-6 sm:px-8 rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold text-sm sm:text-base transition-colors flex items-center justify-center"
      >
        Submit →
      </Button>
    </form>
  )
}
