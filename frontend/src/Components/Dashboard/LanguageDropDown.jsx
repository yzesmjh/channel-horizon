import { ChevronDownIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import ReactFlagsSelect, { Gb, Us } from 'react-flags-select-2';

function LanguageDropDown() {
  const [selected, setSelected] = useState('US'); // Default country code

  return (
        <div className='flex gap-2 w-auto items-center'>

            <div className='text-sm'>
        
            <Gb/>
        </div>
        <p className='text-white text-xs'>English</p>
        </div>
  );
}

export default LanguageDropDown;
