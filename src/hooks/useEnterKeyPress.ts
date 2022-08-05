import { useEffect, useState } from 'react';
import { RefCallBack } from 'react-hook-form';

export const useEnterKeyPress = ({
  ref,
  cb,
}: {
  ref: any;
  cb: (value: string) => any;
}): boolean => {
  const [enterKeyPressed, setEnterKeyPressed] = useState(false);

  const downHandler = (event: { target: any; key?: string; keyCode: number }) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      if (cb) cb(ref.current.value);
      ref.current.blur();
      setEnterKeyPressed(true);
    }
  };

  useEffect(() => {
    const { current } = ref;

    current.addEventListener('keydown', downHandler);

    return () => {
      current.removeEventListener('keydown', downHandler);
    };
  }, [ref.current]);

  return enterKeyPressed;
};
