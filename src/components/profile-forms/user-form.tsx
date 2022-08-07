import { toast } from 'react-toastify';
import { trpc } from '../../utils/trpc';
import { Input } from '../input';

export const UserForm = ({
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
  const errorNotify = (field: string) =>
    toast.error(`Oops! There was an error on the ${field} field 😭`);

  return (
    <div className="flex flex-col items-start">
      <h3 className="mb-3">profile</h3>
      <div className="p-4 bg-slate-700 rounded-xl w-full">
          {/* upload avatar with react-dropzone and S3 */}

          <Input
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

          <Input
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

          <Input
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
      </div>
    </div>
  );
};
