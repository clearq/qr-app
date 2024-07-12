'use client';
import React, { useState } from 'react';
import Card from './Card';
import { ChromePicker } from 'react-color';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

const CardForm: React.FC = () => {
  const [isRounded, setIsRounded] = useState(false);
  const [stamps, setStamps] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');

  return (
    <div className="">
      <div>
        <Label className="mr-4">Card Style:</Label>
        <Button onClick={() => setIsRounded(false)} className="px-4 py-2 bg-primary hover:bg-slate-800">Corners</Button>
        <Button onClick={() => setIsRounded(true)} className="px-4 py-2 ml-2 bg-primary hover:bg-slate-800">Rounded</Button>
      </div>
      <div className='m-4'>
      <Card 
        isRounded={isRounded} 
        stamps={stamps} 
        firstName={firstName} 
        lastName={lastName} 
        backgroundColor={backgroundColor} 
        textColor={textColor} 
      />
      </div>
      <div>
        <Label>Number of Stamps:</Label>
        <Input type="number" value={stamps} onChange={(e) => setStamps(parseInt(e.target.value))} className="w-[10%] mt-1 p-2 border rounded"/>
      </div>
      <div>
        <Label>First Name:</Label>
        <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className=" w-[50%] mt-1 p-2 border rounded"/>
      </div>
      <div>
        <Label>Last Name:</Label>
        <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-[50%] mt-1 p-2 border rounded"/>
      </div>
      <div className="flex w-[50%] space-x-4">
        <div>
          <Label>Background Color:</Label>
          <ChromePicker color={backgroundColor} onChangeComplete={(color:any) => setBackgroundColor(color.hex)} />
        </div>
        <div>
          <Label>Text Color:</Label>
          <ChromePicker color={textColor} onChangeComplete={(color: any) => setTextColor(color.hex)} />
        </div>
      </div>
    </div>
  );
};

export default CardForm;
