import { NextPage } from 'next';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { trpc } from '../utils/trpc';
import { useForm, SubmitHandler } from 'react-hook-form';
import { CreateUsernameInput } from '../schema/user.schema';

const UsernameForm = () => {
  const { mutate } = trpc.useMutation('user.username');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUsernameInput>();

  console.log(errors);

  const onSubmit: SubmitHandler<CreateUsernameInput> = (data) => {
    mutate(
      {
        username: data.username,
      },
      {
        onSuccess: () => {
          console.log('success');
        },
        onError: (error) => {
          console.log(error);
        },
      },
    );
  };

  return (
    <>
      <h3 className="max-w-sm">Welcome to me3, let{`'`}s start choosing an username 🥳</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* register your input into the hook by invoking the "register" function */}
        <input placeholder="username" {...register('username', { required: true })} />

        <input type="submit" />

        <br />
        {errors.username && <span>Username is required</span>}
      </form>
    </>
  );
};

const ProfilePage: NextPage = () => {
  const { data: userData, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <Loading />;

  if (status === 'unauthenticated') {
    router.push('/');
  }

  return (
    <>
      {/* TODO add SEO */}
      <Head>
        <title>Me3 - Profile</title>
        <meta name="description" content="Me3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto flex flex-col items-center justify-between min-h-screen px-4">
        <div className="w-full md:w-96 p-7 flex flex-col items-center justify-center bg-slate-800 rounded-bl-[3rem] rounded-br-[3rem]">
          <h2 className="text-3xl heading">profile</h2>
          <p className="py-5">{userData?.user?.email}</p>
          <div className="flex items-center">
            {userData?.user?.username && (
              <Link href={`/u/${userData?.user?.username}`} passHref>
                <a className="btn-secondary mr-3">see live profile</a>
              </Link>
            )}
            <button className="btn-secondary" onClick={() => signOut()}>
              logout
            </button>
          </div>
        </div>

        <main className="text-center">
          {userData?.user?.username ? (
            <h1 className="text-2xl md:text-5xl lg:text-5xl 2xl:text-6xl leading-snug font-bold">
              sign up, <br />
              fill your info, <br />
              share your profile.
            </h1>
          ) : (
            <UsernameForm />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProfilePage;
