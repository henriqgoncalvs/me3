import type { NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  // const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);
  const { status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="container mx-auto flex flex-col items-center justify-between min-h-screen px-4">
        <main className="text-center">
          <h1 className="text-2xl md:text-5xl lg:text-5xl 2xl:text-6xl leading-tight font-bold">
            loading...
          </h1>
        </main>
      </div>
    );
  }

  if (status === 'authenticated') {
    router.push('/profile');
  }

  return (
    <>
      {/* TODO add SEO */}
      <Head>
        <title>Me3</title>
        <meta name="description" content="Me3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto flex flex-col items-center justify-between min-h-screen px-4">
        <div className="w-full md:w-96 p-7 flex flex-col items-center justify-center bg-slate-800 rounded-bl-[3rem] rounded-br-[3rem]">
          <h2 className="text-3xl text-pink-600">me3</h2>
        </div>

        <main className="text-center">
          <h1 className="text-2xl md:text-5xl lg:text-5xl 2xl:text-6xl leading-tight font-bold">
            sign up, <br />
            fill your info, <br />
            share your profile.
          </h1>

          <p className="font-heading text-sm py-7">
            and show your friends <br /> who you are in 3 items. 😉
          </p>

          <div className="mt-5">
            <button onClick={() => signIn('github')}>login with github 🐈‍⬛</button>
          </div>
        </main>

        <div className="w-full md:w-96 p-5 flex flex-col items-center justify-center bg-slate-800 rounded-tl-[3rem] rounded-tr-[3rem] text-slate-500 text-sm">
          <p className="mb-3">
            check this project in{' '}
            <a href="https://github.com/hnqg/me3" className="underline">
              Github
            </a>
          </p>
          <p>
            me3 is a creation of{' '}
            <Link href="/u/hnqg" passHref>
              <a className="text-pink-600 font-heading text-xs">@hnqg</a>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
