'use client'
import { Input } from '@/components/ui/input';
import { QrStyleContext } from '@/context/index';
import { useCallback, useContext, useEffect, useState } from 'react';

const EmailInput = () => {
  const { dispatch } = useContext(QrStyleContext);
  const [fields, setFields] = useState({
    email: '',
    subject: '',
    message: '',
    touched: {
      email: false,
      subject: false,
      message: false,
    },
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (fields.email && fields.subject && fields.message) {
      timeoutId = setTimeout(() => {
        if (validateEmail(fields.email)) {
          const mailtoLink = `mailto:${fields.email}?subject=${encodeURIComponent(
            fields.subject
          )}&body=${encodeURIComponent(fields.message)}`;
          dispatch({ type: 'SET_QR_VALUE', payload: { value: mailtoLink } });
        } else {
          dispatch({ type: 'SET_QR_VALUE', payload: { value: "I'm EMPTY" } });
        }
      }, 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [fields.email, fields.subject, fields.message, dispatch]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prevState) => ({ ...prevState, email: e.target.value }));
  }, []);

  const handleSubjectChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prevState) => ({ ...prevState, subject: e.target.value }));
  }, []);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prevState) => ({ ...prevState, message: e.target.value }));
  }, []);

  const handleBlur = (field: string) => {
    setFields((prevState) => ({
      ...prevState,
      touched: { ...prevState.touched, [field]: true },
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  return (
    <>
      <Input
        id="email-input"
        
        
        onChange={handleEmailChange}
        onBlur={() => handleBlur('email')}
        value={fields.email}
       
        type={'email'}
        
      />
      {!validateEmail(fields.email) && fields.email !== '' && (
        <p className={'mb-2 mt-0 text-sm text-red-500'}>Please enter a valid email address</p>
      )}
      <Input
        id="subject-input"
        
        onChange={handleSubjectChange}
        onBlur={() => handleBlur('subject')}
        value={fields.subject}
        type={'text'}
      />
      <Input
        id="message-input"
        
        onChange={handleMessageChange}
        onBlur={() => handleBlur('message')}
        value={fields.message}
       
       
      
        type={'text'}
        
      />

      <p className={'mt-3 text-sm text-light'}>
        Your QR code will be generated automatically once you fill in all three fields{' '}
        <strong>with a valid email address</strong>
      </p>
    </>
  );
};

export default EmailInput;
