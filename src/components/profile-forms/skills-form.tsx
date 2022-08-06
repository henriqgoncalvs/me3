import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import { UserSkill } from '../../schema/user-skill.schema';
import { trpc } from '../../utils/trpc';
import { Input } from '../input';

const SkillInput = ({
  name,
  label,
  userSkill,
}: {
  name: string;
  label: string;
  userSkill?: UserSkill;
}) => {
  const { mutate } = trpc.useMutation(['user-skills.add-skill']);
  const errorNotify = () => toast.error(`Oops! There was an error on the skill field 😭`);

  return (
    <Input
      name={name}
      defaultValue={userSkill?.skill || ''}
      label={label}
      onBlurCallback={({ value, errorHandler }) => {
        if (value !== userSkill?.skill) {
          mutate(
            { skill: value, id: userSkill?.id },
            {
              onError: (e) => {
                errorNotify();
                if (errorHandler) errorHandler();
              },
            },
          );
        }
      }}
      placeholder="your skill"
    />
  );
};

export const SkillsForm = () => {
  const { data, isLoading } = trpc.useQuery(['user-skills.get-skills']);

  return (
    <div className="flex flex-col items-start mt-5">
      <h3 className="mb-3">your 3 skills 🤹‍♀️</h3>
      <div className="p-4 bg-slate-700 rounded-xl w-full">
        {isLoading ? (
          // TODO style skeleton
          <Skeleton count={3} />
        ) : (
          <form onSubmit={(e: any) => e.preventDefault()}>
            <SkillInput name="skill1" label="first skill" userSkill={data?.[0]} />
            <SkillInput name="skill2" label="second skill" userSkill={data?.[1]} />
            <SkillInput name="skill3" label="third skill" userSkill={data?.[2]} />
          </form>
        )}
      </div>
    </div>
  );
};
