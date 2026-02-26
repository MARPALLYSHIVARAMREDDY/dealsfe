import { Suspense } from 'react'
import { getProfile } from '@/data/authentication/auth-server-only'
import ProfileInitializer from './profile-initializer'

async function ProfileFetcher() {
  const profileData = await getProfile()
  return <ProfileInitializer profileData={profileData} />
}

export default function ProfileProvider() {
  return (
    <Suspense fallback={<div />}>
      <ProfileFetcher />
    </Suspense>
  )
}
