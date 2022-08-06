import { Fragment, LegacyRef, useEffect, useState } from 'react';
import { Combobox } from '@headlessui/react';
import { trpc } from '../../utils/trpc';
import { SongFromSpotify } from '../../lib/spotify';
import { useDebounce } from '../../hooks/useDebounce';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Skeleton from 'react-loading-skeleton';
import { UserSong } from '../../schema/user-song.schema';

const SongInput = ({ label, userSong }: { label: string; userSong?: UserSong }) => {
  const [selectedTrack, setSelectedTrack] = useState<UserSong | undefined>(userSong);
  const [query, setQuery] = useState('');
  const debounceQuery = useDebounce<string>(query, 600);
  const [trackOptions, setTrackOptions] = useState<UserSong[]>([]);
  const [optionsParentRef] = useAutoAnimate();

  const { mutate } = trpc.useMutation(['user-songs.add-song']);

  const { refetch } = trpc.useQuery(['spotify.search', { q: debounceQuery }], {
    enabled: false,
    onSuccess: (data: UserSong[]) => {
      setTrackOptions(data);
    },
  });

  useEffect(() => {
    if (selectedTrack && selectedTrack.songTitle !== userSong?.songTitle) {
      mutate({
        spotifyId: selectedTrack.spotifyId,
        songTitle: selectedTrack.songTitle,
        artist: selectedTrack.artist,
        albumBannerUrl: selectedTrack.albumBannerUrl,
        previewUrl: selectedTrack.previewUrl || '-',
        id: userSong?.id,
      });
    }
  }, [selectedTrack]);

  useEffect(() => {
    if (debounceQuery && refetch) refetch();
  }, [debounceQuery, refetch]);

  return (
    <div className="mb-4">
      <Combobox value={selectedTrack} onChange={setSelectedTrack}>
        <Combobox.Label>{label}</Combobox.Label>
        <div className="flex items-center w-full">
          {selectedTrack?.albumBannerUrl ? (
            <div className="flex items-center justify-center w-12 h-10 mr-2 pt-1">
              <img src={selectedTrack.albumBannerUrl} className="rounded-md" />
            </div>
          ) : (
            <div className="w-12 h-10 rounded-md mr-3 bg-slate-500 border-dotted border-2 border-dashed border-slate-200" />
          )}
          <Combobox.Input
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(track: UserSong) =>
              track ? `${track.songTitle} - ${track.artist}` : ''
            }
            className="mb-0 mt-1"
          />
        </div>
        <div ref={optionsParentRef as LegacyRef<HTMLDivElement> | undefined}>
          {!!trackOptions.length && (
            <Combobox.Options className="text-xs py-2 rounded-xl">
              {trackOptions.map((track) => (
                <Combobox.Option
                  key={track.spotifyId}
                  value={track}
                  className="p-1 bg-slate-500 flex m-1 rounded-xl cursor-pointer hover:bg-slate-400 items-center"
                >
                  {track.albumBannerUrl && (
                    <img src={track.albumBannerUrl} className="w-auto h-10 rounded-md" />
                  )}
                  <div className="flex flex-col flex-1 text-left pl-2">
                    <p className="">{track.songTitle}</p>
                    <p>{track.artist}</p>
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

export const SongsForm = () => {
  const { data, isLoading } = trpc.useQuery(['user-songs.get-songs']);

  console.log(data);

  return (
    <div className="flex flex-col items-start mt-5">
      <h3 className="mb-3">your 3 songs 🎧</h3>
      <div className="p-4 bg-slate-700 rounded-xl w-full">
        {isLoading ? (
          // TODO style skeleton
          <Skeleton count={3} />
        ) : (
          <>
            <SongInput label="first song" userSong={data?.[0]} />
            <SongInput label="second song" userSong={data?.[1]} />
            <SongInput label="third song" userSong={data?.[2]} />
          </>
        )}
      </div>
    </div>
  );
};
