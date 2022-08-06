/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Combobox } from '@headlessui/react';
import { LegacyRef, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useDebounce } from '../../hooks/useDebounce';
import { TMDB_IMAGE_BASE_URL } from '../../lib/tmdb';
import { UserMovie } from '../../schema/user-movie.schema';
import { trpc } from '../../utils/trpc';
import { InputSkeleton } from '../input-skeleton';

const MovieInput = ({ label, userMovie }: { label: string; userMovie?: UserMovie }) => {
  const [selectedMovie, setSelectedMovie] = useState<UserMovie | undefined>(userMovie);
  const [query, setQuery] = useState('');
  const debounceQuery = useDebounce<string>(query, 600);
  const [movieOptions, setMovieOptions] = useState<UserMovie[]>([]);
  const [optionsParentRef] = useAutoAnimate();

  const { mutate } = trpc.useMutation(['user-movies.add-movie']);

  const { refetch } = trpc.useQuery(['tmdb.search-movie', { q: debounceQuery }], {
    enabled: false,
    onSuccess: (data: UserMovie[]) => {
      setMovieOptions(data);
    },
  });

  useEffect(() => {
    if (selectedMovie && selectedMovie.title !== userMovie?.title) {
      mutate({
        title: selectedMovie.title,
        tmdbId: selectedMovie.tmdbId.toString(),
        posterPath: selectedMovie.posterPath,
        releaseDate: selectedMovie.releaseDate,
        id: userMovie?.id,
      });
    }
  }, [selectedMovie]);

  useEffect(() => {
    if (debounceQuery && refetch) refetch();
  }, [debounceQuery, refetch]);

  return (
    <div className="mb-4">
      <Combobox value={selectedMovie} onChange={setSelectedMovie}>
        <Combobox.Label>{label}</Combobox.Label>
        <div className="flex items-center w-full">
          {selectedMovie?.posterPath ? (
            <div className="flex items-center justify-center w-12 mr-2 pt-1">
              <img
                src={`${TMDB_IMAGE_BASE_URL}${selectedMovie?.posterPath}`}
                alt={`${selectedMovie?.title} poster`}
                className="rounded-md"
              />
            </div>
          ) : (
            <div className="w-12 h-16 rounded-md mr-3 bg-slate-500 border-2 border-dashed border-slate-200" />
          )}
          <Combobox.Input
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(movie: UserMovie) => (movie ? movie.title : '')}
            className="mb-0 mt-1"
          />
        </div>
        <div ref={optionsParentRef as LegacyRef<HTMLDivElement> | undefined}>
          {!!movieOptions.length && (
            <Combobox.Options className="text-xs py-2 rounded-xl">
              {movieOptions.map((movie) => (
                <Combobox.Option
                  key={movie.tmdbId}
                  value={movie}
                  className="p-1 bg-slate-500 flex m-1 rounded-xl cursor-pointer hover:bg-slate-400 items-center"
                >
                  {movie.posterPath ? (
                    <img
                      src={`${TMDB_IMAGE_BASE_URL}${movie.posterPath}`}
                      className="w-auto h-12 rounded-md"
                      alt={`${movie?.title} poster`}
                    />
                  ) : (
                    <div className="w-8 h-12 rounded-md bg-slate-300 flex items-center justify-center text-[0.5rem] text-slate-800 leading-tight">
                      No poster
                    </div>
                  )}
                  <div className="flex flex-col flex-1 text-left pl-2">
                    <p className="">
                      {movie.title} ({movie.releaseDate?.split('-')[0]})
                    </p>
                  </div>
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </div>
  );
};

export const MoviesForm = () => {
  const { data, isLoading } = trpc.useQuery(['user-movies.get-movies']);

  return (
    <div className="flex flex-col items-start mt-5">
      <h3 className="mb-3">your 3 movies 📽️</h3>
      <div className="p-4 bg-slate-700 rounded-xl w-full">
        {isLoading ? (
          <>
            <InputSkeleton />
            <InputSkeleton />
            <InputSkeleton />
          </>
        ) : (
          <>
            <MovieInput label="first movie" userMovie={data?.[0]} />
            <MovieInput label="second movie" userMovie={data?.[1]} />
            <MovieInput label="third movie" userMovie={data?.[2]} />
          </>
        )}
      </div>
    </div>
  );
};
