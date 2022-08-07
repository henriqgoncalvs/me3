/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Footer } from '../../components/footer';
import { TMDB_IMAGE_BASE_URL } from '../../lib/tmdb';
import { prisma } from '../../server/db/client';
import { User } from '../../types/user.type';

const CardsWrapper = ({
  title,
  col = false,
  children,
}: {
  title: string;
  col?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-start py-4 bg-slate-700 rounded-xl w-full mb-5">
      <h3 className="mb-3 border-b-2 border-pink-500 pb-3 w-full">{title}</h3>
      <div
        className={clsx(
          'flex justify-between text-sm gap-3 px-4 pt-1 w-full',
          col ? 'flex-col items-center' : 'items-start',
        )}
      >
        {children}
      </div>
    </div>
  );
};

const AdjectivesCard = ({ adjectives }: { adjectives: User['UserAdjective'] }) => {
  return (
    <CardsWrapper title="3 adjectives 👁️‍🗨️" col>
      {adjectives.map((adj, index) => (
        <div key={adj.id} className="w-full text-center flex flex-col items-center">
          <p className="text-lg">{adj.adjective}</p>
          {index !== adjectives.length - 1 && (
            <div className="bg-purple-500 rounded-full w-2 h-2 mt-3" />
          )}
        </div>
      ))}
    </CardsWrapper>
  );
};

const SkillsCard = ({ skills }: { skills: User['UserSkills'] }) => {
  return (
    <CardsWrapper title="3 skills 🤹‍♀️" col>
      {skills.map((skill, index) => (
        <div key={skill.id} className="w-full text-center flex flex-col items-center">
          <p className="text-lg">{skill.skill}</p>
          {index !== skills.length - 1 && (
            <div className="bg-purple-500 rounded-full w-2 h-2 mt-3" />
          )}
        </div>
      ))}
    </CardsWrapper>
  );
};

const SongsCard = ({ songs }: { songs: User['UserSong'] }) => {
  return (
    <CardsWrapper title="3 songs 🎧">
      {songs.map((song) => (
        <div key={song.id} className="flex-1 flex flex-col items-center">
          {song.albumBannerUrl ? (
            <img
              src={song.albumBannerUrl}
              alt={`${song.songTitle} album cover`}
              className="h-auto w-full rounded-md"
            />
          ) : (
            <div className="h-full w-full bg-slate-400 rounded-md">
              <p className="text-sm">No album cover</p>
            </div>
          )}
          <div className="flex-1 mt-2 mb-1">
            <p>{song.songTitle}</p>
          </div>
          <div className="flex-1 text-[0.7rem] text-slate-400">
            <p>{song.artist}</p>
          </div>
        </div>
      ))}
    </CardsWrapper>
  );
};

const MoviesCard = ({ movies }: { movies: User['UserMovie'] }) => {
  return (
    <CardsWrapper title="3 movies 📽️">
      {movies.map((movie) => (
        <div key={movie.id} className="flex-1 flex flex-col items-center">
          {movie.posterPath ? (
            <img
              src={`${TMDB_IMAGE_BASE_URL}${movie.posterPath}`}
              alt={`${movie.title} poster`}
              className="h-auto w-full rounded-md"
            />
          ) : (
            <div className="h-full w-full bg-slate-400 rounded-md">
              <p className="text-sm">No poster cover</p>
            </div>
          )}
          <div className="flex-1 mt-2 mb-1">
            <p>{movie.title}</p>
          </div>
          <div className="flex-1 text-[0.7rem] text-slate-400">
            <p>{movie.releaseDate?.split('-')[0]}</p>
          </div>
        </div>
      ))}
    </CardsWrapper>
  );
};

const UserPage = ({ user }: { user: User }) => {
  console.log(user);

  return (
    <>
      <Head>
        <title>Me3 - {user.username}</title>
        <meta name="description" content="Me3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto flex flex-col items-center justify-between min-h-screen px-4">
        <div className="w-full md:w-96 px-7 pb-7 pt-3 flex flex-col items-start justify-center bg-slate-800 rounded-bl-[3rem] rounded-br-[3rem]">
          <Link href="/" passHref>
            <a className="text-sm pb-5 self-center">
              created with{' '}
              <span className="font-heading text-[0.8rem] bg-gradient animate-bg bg-clip-text text-transparent">
                me3
              </span>{' '}
            </a>
          </Link>
          <div className="flex items-center w-full">
            {user.image && (
              <img
                src={user.image}
                alt={`${user.username}'s profile picture`}
                className="w-16 h-auto rounded-full mr-4 outline outline-1 outline-offset-2 outline-pink-600"
              />
            )}
            <div className="flex flex-col items-start">
              {user.name ? (
                <>
                  <h2 className="text-2xl heading">{user.name}</h2>
                  <p>@{user.username}</p>
                </>
              ) : (
                <h2 className="text-3xl heading">@{user.username}</h2>
              )}
            </div>
          </div>

          {user.bio && (
            <div className="pt-7">
              <h4 className="text-sm">👋 about me</h4>
              <p className="my-2 text-[0.9rem]">{user.bio}</p>
            </div>
          )}
        </div>

        <p className="pt-5 text-xs">hey, wanna know more about me?</p>

        <main className="text-center w-full md:w-96 px-1 flex-1 my-5">
          <AdjectivesCard adjectives={user.UserAdjective} />
          <SkillsCard skills={user.UserSkills} />
          <SongsCard songs={user.UserSong} />
          <MoviesCard movies={user.UserMovie} />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default UserPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext<{ username: string }>) {
  const { params } = ctx;
  const { username } = params ?? { username: null };

  if (username) {
    const foundUser = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        UserAdjective: true,
        UserSkills: true,
        UserMovie: true,
        UserSong: true,
      },
    });

    if (foundUser) {
      return {
        props: {
          user: foundUser,
        },
      };
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: '/',
    },
  };
}
