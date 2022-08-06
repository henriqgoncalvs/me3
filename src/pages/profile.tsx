import { GetServerSidePropsContext, NextPage } from 'next';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { Footer } from '../components/footer';
import { trpc } from '../utils/trpc';
import { useForm, SubmitHandler } from 'react-hook-form';
import { UsernameInputSchema } from '../schema/username.schema';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { useState } from 'react';
import { UserForm } from '../components/profile-forms/user-form';
import { SongsForm } from '../components/profile-forms/songs-form';
import { MoviesForm } from '../components/profile-forms/movies-form';
import { AdjectivesForm } from '../components/profile-forms/adjectives-form';

const UsernameForm = ({ setUsername }: { setUsername: (username: string) => void }) => {
  const { mutate } = trpc.useMutation('user.username');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsernameInputSchema>();

  const onSubmit: SubmitHandler<UsernameInputSchema> = (data) => {
    mutate(
      {
        username: data.username,
      },
      {
        onSuccess: () => {
          setUsername(data.username);
        },
      },
    );
  };

  return (
    <>
      <h3 className="max-w-sm mb-3">Welcome to me3, let{`'`}s start choosing an username 🥳</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="username" {...register('username', { required: true })} />

        <input type="submit" />

        <br />
        {errors.username && <span>Username is required</span>}
      </form>
    </>
  );
};

const ProfilePage: NextPage = () => {
  const { data: userData } = useSession();
  const [username, setUsername] = useState<string | null | undefined>(userData?.user?.username);

  return (
    <>
      <Head>
        <title>Me3 - Profile</title>
        <meta name="description" content="Me3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto flex flex-col items-center justify-between min-h-screen px-4">
        <div className="w-full md:w-96 p-7 flex flex-col items-center justify-center bg-slate-800 rounded-bl-[3rem] rounded-br-[3rem]">
          {username ? (
            <h2 className="text-3xl heading">@{username}</h2>
          ) : (
            <h2 className="text-3xl heading">username</h2>
          )}
          <p className="my-5">{userData?.user?.email}</p>
          <div className="flex items-center">
            {username && (
              <Link href={`/u/${username}`} passHref>
                <a className="btn-secondary mr-3">see live profile</a>
              </Link>
            )}
            <button className="btn-secondary" onClick={() => signOut()}>
              logout
            </button>
          </div>
        </div>

        <main className="text-center w-full md:w-96 px-1 py-4 flex-1 my-5">
          {userData?.user?.username || username ? (
            <div className="w-full">
              <UserForm
                bio={userData?.user?.bio}
                name={userData?.user?.name || undefined}
                username={userData?.user?.username}
                setUsername={setUsername}
              />
              <AdjectivesForm />
              <SongsForm />
              <MoviesForm />
            </div>
          ) : (
            <UsernameForm setUsername={setUsername} />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProfilePage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (!session?.user) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
