import { GetServerSidePropsContext, NextPage } from 'next';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { Footer } from '../components/footer';
import { Loading } from '../components/loading';
import { trpc } from '../utils/trpc';
import { useForm, SubmitHandler } from 'react-hook-form';
import { UsernameInputSchema } from '../schema/username.schema';
import { EditUserInputSchema } from '../schema/user.schema';
import { Input } from '../components/input';
import { toast } from 'react-toastify';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { useState } from 'react';

const UsernameForm = () => {
  const { mutate } = trpc.useMutation('user.username');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsernameInputSchema>();

  const onSubmit: SubmitHandler<UsernameInputSchema> = (data) => {
    mutate({
      username: data.username,
    });
  };

  return (
    <>
      <h3 className="max-w-sm">Welcome to me3, let{`'`}s start choosing an username 🥳</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="username" {...register('username', { required: true })} />

        <input type="submit" />

        <br />
        {errors.username && <span>Username is required</span>}
      </form>
    </>
  );
};

const UserForm = ({
  name,
  bio,
  username,
  setUsername,
}: {
  name?: string;
  bio?: string;
  username?: string;
  setUsername: (value: string) => void;
}) => {
  const { mutate } = trpc.useMutation('user.edit-user');
  const { mutate: usernameMutate } = trpc.useMutation('user.username');
  const { register } = useForm<EditUserInputSchema & { username?: string }>();
  const errorNotify = (field: string) =>
    toast.error(`Oops! There was an error on the ${field} field 😭`);

  return (
    <div className="flex flex-col items-start mt-5">
      <h3 className="mb-3">profile</h3>
      <div className="p-4 bg-slate-700 rounded-xl w-full">
        <form onSubmit={(e: any) => e.preventDefault()}>
          {/* upload avatar with react-dropzone and S3 */}

          <Input<{ username?: string }>
            register={register}
            name="username"
            defaultValue={username || ''}
            label="username"
            onBlurCallback={({ value, errorHandler }) =>
              usernameMutate(
                { username: value },
                {
                  onSuccess: (data) => {
                    setUsername(data.username as string);
                  },
                  onError: (e) => {
                    toast.error(`Oops! This username is already taken, choose another one!`);
                    if (errorHandler) errorHandler();
                  },
                },
              )
            }
            placeholder="@"
          />

          <Input<EditUserInputSchema>
            register={register}
            name="name"
            defaultValue={name || ''}
            label="name"
            onBlurCallback={({ value, errorHandler }) =>
              mutate(
                { name: value },
                {
                  onError: (e) => {
                    errorNotify('name');
                    if (errorHandler) errorHandler();
                  },
                },
              )
            }
            placeholder="name"
          />

          <Input<EditUserInputSchema>
            register={register}
            name="bio"
            type="textarea"
            defaultValue={bio || ''}
            label="bio"
            onBlurCallback={({ value, errorHandler }) =>
              mutate(
                { bio: value },
                {
                  onError: (e) => {
                    errorNotify('name');
                    if (errorHandler) errorHandler();
                  },
                },
              )
            }
            placeholder="bio"
            maxLength={80}
          />
        </form>
      </div>
    </div>
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
          <h2 className="text-3xl heading">profile</h2>
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

        <main className="text-center w-full md:w-96 px-1 py-4 flex-1">
          {userData?.user?.username ? (
            <div className="w-full">
              <UserForm
                bio={userData.user.bio}
                name={userData.user.name || undefined}
                username={userData.user.username}
                setUsername={setUsername}
              />
            </div>
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
