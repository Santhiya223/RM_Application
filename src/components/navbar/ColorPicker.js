// components/ColorPicker.js
import { useState } from 'react';

const ColorPicker = () => {
  const [primaryColor, setPrimaryColor] = useState('#fff'); // Default primary color

  const handlePrimaryChangeComplete = (event) => {
    const color = event.target.value; // Get the color value from the event
    setPrimaryColor(color);
    document.documentElement.style.setProperty('--background-color', color); // Update CSS variable
  };

  const handleColorSelect = (color) => {
    setPrimaryColor(color);
    document.documentElement.style.setProperty('--background-color', color); // Update CSS variable
  };

  const defaultColors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD', '#E74C3C'];
  return (
    <div className='flex flex-col items-center'>
      <div className='flex space-x-2 mb-4'>
        {defaultColors.map((color) => (
          <div
            key={color}
            onClick={() => handleColorSelect(color)}
            className='w-10 h-10 rounded-full cursor-pointer'
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <input
        type='color'
        value={primaryColor}
        onChange={handlePrimaryChangeComplete}
        className='rounded-lg'
      />
      <p className='mt-2'>Selected Color: {primaryColor}</p>
    </div>
  );
};

export default ColorPicker;