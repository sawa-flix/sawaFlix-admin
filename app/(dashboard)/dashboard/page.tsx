'use client'
import { useEffect, useState } from "react";
import SawaFlix from "../../../components/Dashboard/SawaFlix";
import { createClient } from '../../../utils/supabase/client'
import { User as SupabseUser } from '@supabase/supabase-js'
import { useRouter } from "next/navigation";

type UserData = {
  username:string | null;
  role: string | null;
}

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserData | null>(null);
  const [currentUser, setCurrentUser] = useState<SupabseUser | null>(null);
  const [showHeader, setShowHeader] = useState(true); // New state to control header visibility
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (user) {
        const { data: profileData, error } = await supabase
        .from('users')
        .select('username, role')
        .eq('id', user.id)
        .single<UserData>();

        if (error) {
          console.error('error fetching user:', error.message);
        } else if (profileData) {
          setUserProfile(profileData);
          
          // If admin, redirect to admin portal
          /*
          if (profileData.role === 'admin') {
            router.push('/admin');
          }
          */
        }
      }
    };
    fetchUser();

    // Set a timeout to hide the header after 3 minutes (3 * 60 * 1000 milliseconds)
    const timer = setTimeout(() => {
      setShowHeader(false);
    }, 1 * 60 * 1000);

    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []); // The useEffect runs once when the component mounts

  return (
    <div className="min-h-full">
      {showHeader && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome back, {userProfile?.username}!
          </h1>
          <p className="text-gray-400">
            Here&apos;s what&apos;s trending in your entertainment world.
          </p>
        </div>
      )}
      <SawaFlix />
    </div>
  );
}