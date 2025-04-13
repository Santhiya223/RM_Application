// // UserProfile.js
// import React from 'react';
// import Image from 'next/image';
// import avatar1 from '@/assets/images/users/management.png';

// const UserProfile = ({ user, onLogout }) => {
//   return (
//     <div className="d-flex align-items-center ">
//       <Image
//         src={user.profilePicture || avatar1}
//         alt={user.name}
//         className="rounded-circle me-2"
//         height={20}
//         width={30}
//       />
//       <span className="me-2">{user.name}</span>
//     </div>
//   );
// };

// export default UserProfile;

// UserProfile.js
import React, { useState } from 'react';
import Image from 'next/image';
import avatar1 from '@/assets/images/users/management.png';
import { Dropdown } from 'react-bootstrap';
import ColorPicker from './ColorPicker';

const UserProfile = ({ user, onLogout }) => {
  const [theme, setTheme] = useState('light'); // Default theme

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // Implement your theme change logic here
    console.log(`Theme changed to: ${newTheme}`);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="link" className="d-flex align-items-center">
        <Image
          src={user.image || avatar1}
          alt={user.username}
          className="rounded-circle me-2"
          height={30}
          width={30}
        />
        <span className="me-2">{user.username}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item disabled>
          <div className="d-flex align-items-center">
            <Image
              src={user.image || avatar1}
              alt={user.username}
              className="rounded-circle me-2"
              height={40}
              width={40}
            />
            <span>{user.username}</span>
          </div>
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Header>Theme</Dropdown.Header>
        <ColorPicker/>
        <Dropdown.Divider />
        <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserProfile;