/* eslint-disable react-hooks/exhaustive-deps */
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Combobox } from '@headlessui/react';
import { LegacyRef, useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { adjectivesList } from '../../lib/adjectives-list';
import { UserAdjective } from '../../schema/user-adjective.schema';
import { trpc } from '../../utils/trpc';
import { InputSkeleton } from '../input-skeleton';

const AdjectiveInput = ({
  label,
  userAdjective,
}: {
  label: string;
  userAdjective?: UserAdjective;
}) => {
  const [selectedAdjective, setSelectedAdjective] = useState<string | undefined>(
    userAdjective?.adjective,
  );
  const [query, setQuery] = useState('');
  const [optionsParentRef] = useAutoAnimate();

  const { mutate } = trpc.useMutation(['user-adjectives.add-adjective']);

  const filteredAdjectivesList = useMemo(() => {
    return query
      ? adjectivesList
          .filter((adjective) => adjective.toLowerCase().includes(query.toLowerCase()))
          .splice(0, 5)
      : [];
  }, [query]);

  useEffect(() => {
    if (selectedAdjective && selectedAdjective !== userAdjective?.adjective) {
      mutate({
        adjective: selectedAdjective,
        id: userAdjective?.id,
      });
    }
  }, [selectedAdjective]);

  return (
    <div className="mb-4">
      <Combobox value={selectedAdjective} onChange={setSelectedAdjective}>
        <Combobox.Label>{label}</Combobox.Label>
        <div className="flex items-center w-full">
          <Combobox.Input
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(adjective: string) => (adjective ? adjective : '')}
            className="mb-0 mt-1"
          />
        </div>
        <div ref={optionsParentRef as LegacyRef<HTMLDivElement> | undefined}>
          {!!filteredAdjectivesList.length && (
            <Combobox.Options className="text-xs py-2 rounded-xl">
              {filteredAdjectivesList.map((adjective) => (
                <Combobox.Option
                  key={adjective}
                  value={adjective}
                  className="p-2 bg-slate-500 flex m-1 rounded-md cursor-pointer hover:bg-slate-400 items-center"
                >
                  <div className="flex flex-col flex-1 text-left pl-2">
                    <p className="">{adjective}</p>
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

export const AdjectivesForm = () => {
  const { data, isLoading } = trpc.useQuery(['user-adjectives.get-adjectives']);

  return (
    <div className="flex flex-col items-start mt-5">
      <h3 className="mb-3">your 3 adjectives 👁️‍🗨️</h3>
      <div className="p-4 bg-slate-700 rounded-xl w-full">
        {isLoading ? (
          <>
            <InputSkeleton />
            <InputSkeleton />
            <InputSkeleton />
          </>
        ) : (
          <>
            <AdjectiveInput label="first adjective" userAdjective={data?.[0]} />
            <AdjectiveInput label="second adjective" userAdjective={data?.[1]} />
            <AdjectiveInput label="third adjective" userAdjective={data?.[2]} />
          </>
        )}
      </div>
    </div>
  );
};
