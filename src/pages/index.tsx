import type { GetServerSidePropsContext, NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';

import Head from 'next/head';
import { Footer } from '../components/footer';
import { getServerAuthSession } from '../server/common/get-server-auth-session';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>me3</title>
        <meta name="description" content="Describe yourself in 3 things, as simple as that." />
        <link rel="icon" href="/favicon.ico" />

        <meta property="og:title" content="me3" />
        <meta property="og:site_name" content="me3" />
        <meta property="twitter:site" content="me3" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://me3.hnqg.io" />
        <meta property="og:image" content="/favicon.ico" />
      </Head>

      <div className="container mx-auto flex flex-col items-center justify-between min-h-screen px-4">
        <div className="w-full md:w-96 p-7 flex flex-col items-center justify-center bg-slate-800 rounded-bl-[3rem] rounded-br-[3rem]">
          <h2 className="text-3xl text-pink-600">me3</h2>
        </div>

        <main className="text-center">
          <h1 className="text-2xl md:text-5xl lg:text-5xl 2xl:text-6xl leading-snug font-bold">
            sign up, <br />
            fill your info, <br />
            share your profile.
          </h1>

          <p className="font-heading text-sm py-7">
            and show your friends <br /> who you are in 3 items. 😉
          </p>

          <div className="mt-5 flex flex-col items-center">
            <button onClick={() => signIn('github')}>login with github 🐈‍⬛</button>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Home;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (session?.user) {
    return {
      redirect: {
        permanent: false,
        destination: '/profile',
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
