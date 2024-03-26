import { useCallback, useMemo, useState } from 'react';
import Bell01Icon from '@untitled-ui/icons-react/build/esm/Bell01';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';

import { usePopover } from 'src/hooks/use-popover';
import { notifications as initialNotifications } from './notifications';
import { useEffect } from 'react';
import { NotificationsPopover } from './notifications-popover';
import { useRouter } from 'next/navigation';
import sendHttpRequest from 'src/utils/send-http-request';
import Popover from '@mui/material/Popover';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import Mail04Icon from '@untitled-ui/icons-react/build/esm/Mail04';
import MessageChatSquareIcon from '@untitled-ui/icons-react/build/esm/MessageChatSquare';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Scrollbar } from 'src/components/scrollbar';

// const useNotifications = (props) => {
//   const [notifications, setNotifications] = useState(props);
//   const unread = useMemo(() => {
//     return notifications.reduce((acc, notification) => acc + (notification.read ? 0 : 1), 0);
//   }, [notifications]);

//   const handleRemoveOne = useCallback((notificationId) => {
//     setNotifications((prevState) => {
//       return prevState.filter((notification) => notification.id !== notificationId);
//     });
//   }, []);

//   const handleMarkAllAsRead = useCallback(() => {
//     setNotifications((prevState) => {
//       return prevState.map((notification) => ({
//         ...notification,
//         read: true,
//       }));
//     });
//   }, []);

//   return {
//     handleMarkAllAsRead,
//     handleRemoveOne,
//     notifications,
//     unread,
//   };
// };

export const NotificationsButton = () => {
  const [numUnread, setUnread] = useState(0);
  const router = useRouter();
  let pageNum = 1;
  let noNext = false;
  let noPrevious = true;

  useEffect(() => {
    if (router.isReady === false) {
      return;
    }
    sendHttpRequest('http://localhost:8000/notifications/list/?page=1', 'GET')
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          return response.data;
        } else if (response.status === 401 || response.status === 403) {
          router.push('/401');
        } else if (response.status === 404) {
          router.push('/404');
        } else {
          router.push('/500');
        }
      })
      .then((data) => {
        console.log(data);
        setUnread(data['unread']);
      });
  }, [router]);

  const popover = usePopover();

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          ref={popover.anchorRef}
          onClick={popover.handleOpen}
        >
          <Badge
            color="error"
            badgeContent={numUnread}
          >
            <SvgIcon>
              <Bell01Icon />
            </SvgIcon>
          </Badge>
        </IconButton>
      </Tooltip>
      <NotificationsPopover
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
      />
    </>
  );
};
