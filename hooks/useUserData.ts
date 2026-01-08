import { db } from '@/FirebaseConfig';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  photoUrl?: string;
}

export function useUserData() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (user?.uid) {
        setLoading(true);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setUserData(null);
        setLoading(false);
      }
    }
    fetchUserData();
  }, [user?.uid]);

  const fullName =
    userData?.firstName && userData?.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : user?.email || 'User';

  const initials =
    userData?.firstName && userData?.lastName
      ? `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase()
      : user?.email?.[0].toUpperCase() || 'U';

  const photoUrl = userData?.photoUrl || user?.photoURL;

  return {
    userData,
    loading,
    fullName,
    initials,
    photoUrl,
  };
}
