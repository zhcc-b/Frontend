import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import SvgIcon from '@mui/material/SvgIcon';

import { usePopover } from 'src/hooks/use-popover';

import { AccountPopover } from './account-popover';
import sendHttpRequest from 'src/utils/send-http-request';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export const AccountButton = () => {
  const popover = usePopover();
  const token = localStorage.getItem('JWT');
  const router = useRouter();

  const uid = jwtDecode(token).user_id;
  const [userData, setUserData] = useState({ email: '', username: '', avatar: '' });

  useEffect(() => {
    if (router.isReady === false) {
      return;
    }

    sendHttpRequest(`http://localhost:8000/accounts/${uid}/`, 'GET').then((response) => {
      if (response.status === 200 || response.status === 201) {
        const originalData = {
          email: response.data.email,
          username: response.data.username,
          avatar: response.data.avatar,
        };
        setUserData(originalData);
      } else if (response.status === 401 || response.status === 403) {
        router.push('/401');
      } else if (response.status === 404) {
        router.push('/404');
      } else {
        router.push('/500');
      }
    });
  }, [uid, setUserData, router]);

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex',
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'divider',
          height: 40,
          width: 40,
          borderRadius: '50%',
        }}
      >
        <Avatar
          sx={{
            height: 32,
            width: 32,
          }}
          src={userData.avatar}
        >
          <SvgIcon>
            <User01Icon />
          </SvgIcon>
        </Avatar>
      </Box>
      <AccountPopover
        userData={userData}
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
      />
    </>
  );
};
