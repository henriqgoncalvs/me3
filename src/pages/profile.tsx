import { NextPage } from 'next';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const ProfilePage: NextPage = () => {
  const { data, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    router.push('/');
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <p className="text-2xl text-gray-700">Email: {data?.user?.email}</p>
      <p className="text-2xl text-gray-700">Email: {data?.user?.name}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export default ProfilePage;
