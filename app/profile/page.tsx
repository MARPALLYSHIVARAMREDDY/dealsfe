import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import ProfilePage from '@/components/auth/profile';
import { ProfileSkeleton } from '@/components/auth/profile/profile-skeleton';
import { getProfile } from '@/data/authentication/auth-server-only';

/**
 * Profile page route
 * Server-side auth check with redirect
 */
async function ProfileContent() {
  // Server-side auth check
  const profile = await getProfile();

  if (!profile) {
    // Not authenticated - redirect to auth with return URL (no locale)
    redirect('/auth?redirect=/profile');
  }

  // Authenticated - render profile page
  // Profile data already set in Redux via ProfileInitializer in layout
  return <ProfilePage />;
}

export default async function ProfileRoute() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
