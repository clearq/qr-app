'use client'
import { Input } from '@/components/ui/input';
import { QrStyleContext } from '@/context/index';
import { useContext, useEffect, useState } from 'react';

const TextInput = () => {
  const { state, dispatch } = useContext(QrStyleContext);
  const [debouncedValue, setDebouncedValue] = useState(state.value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (debouncedValue === '') {
        dispatch({ type: 'SET_QR_VALUE', payload: { value: "I'm EMPTY" } });
        return;
      }
      dispatch({ type: 'SET_QR_VALUE', payload: { value: debouncedValue } });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [debouncedValue, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedValue(e.target.value);
  };

  return (
    <div className={'mt-5'}>
      <Input
        id="outlined-multiline-static"
        onChange={handleChange}
        defaultValue={debouncedValue === "I'm EMPTY" ? '' : debouncedValue}
        type={'text'}
      />
      <p className={'mt-3 text-sm text-light'}>Your QR code will be generated automatically</p>
    </div>
  );
};

export default TextInput;
