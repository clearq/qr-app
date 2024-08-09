import React from 'react';
import Lottie from 'lottie-react';
import animationData from '@/public/animations/people.json';

const PeopleAnimation: React.FC = () => {
  return (
    <div className='w-[1px] sm:w-[500px] '>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default PeopleAnimation;