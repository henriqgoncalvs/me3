import { HTMLInputTypeAttribute, useRef, useState } from 'react';
import { MdModeEdit } from 'react-icons/md';
import { useEnterKeyPress } from '../hooks/useEnterKeyPress';

type InputP = {
  name: string;
  onBlurCallback?: ({ value, errorHandler }: { value: string; errorHandler?: () => void }) => any;
  defaultValue?: any;
  placeholder?: string;
  type?: 'input' | 'textarea';
  label: string;
  maxLength?: number;
};

type Event = {
  target: any;
};

export const Input = ({
  name,
  type,
  placeholder,
  defaultValue,
  onBlurCallback,
  label,
  maxLength,
}: InputP) => {
  const [currentValue, setCurrentValue] = useState<string | undefined>(undefined);
  const [isOnFocus, setIsOnFocus] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const errorHandler = () => {
    setCurrentValue(defaultValue);
    if (inputRef.current) {
      inputRef.current.value = defaultValue;
    }
  };

  const customOnBlur = (value: string) => {
    setIsOnFocus(false);

    if (onBlurCallback && value !== defaultValue && value !== currentValue) {
      setCurrentValue(value);
      onBlurCallback({ value, errorHandler });
    }
  };

  useEnterKeyPress({ ref: inputRef, cb: customOnBlur });

  const defaultProps = {
    name,
    defaultValue: defaultValue ?? '',
    placeholder: placeholder ?? 'Type...',
    onFocus: () => setIsOnFocus(true),
    ref: (event: any) => {
      inputRef.current = event;
    },
    ...(onBlurCallback && { onBlur: (event: Event) => customOnBlur(event.target.value) }),
    ...(maxLength && { maxLength }),
  };

  if (type === 'textarea') {
    return (
      <>
        <label htmlFor={name}>{label}</label>
        <div className="relative">
          <textarea {...defaultProps} rows={4} />
          {!isOnFocus && (
            <div className="absolute right-5 top-1 translate-y-1/2 z-20">
              <MdModeEdit size={18} />
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <label htmlFor={name}>{label}</label>
      <div className="relative">
        <input {...defaultProps} />
        {!isOnFocus && (
          <div className="absolute right-5 top-1 translate-y-1/2 z-20">
            <MdModeEdit size={18} />
          </div>
        )}
      </div>
    </>
  );
};
