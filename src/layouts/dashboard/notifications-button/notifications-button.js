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

const useNotifications = (props) => {
  const [notifications, setNotifications] = useState(props);
  const unread = useMemo(() => {
    return notifications.reduce((acc, notification) => acc + (notification.read ? 0 : 1), 0);
  }, [notifications]);

  const handleRemoveOne = useCallback((notificationId) => {
    setNotifications((prevState) => {
      return prevState.filter((notification) => notification.id !== notificationId);
    });
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prevState) => {
      return prevState.map((notification) => ({
        ...notification,
        read: true,
      }));
    });
  }, []);

  return {
    handleMarkAllAsRead,
    handleRemoveOne,
    notifications,
    unread,
  };
};

export const NotificationsButton = () => {
  const [initNotifications, setInit] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady === false) {
      return;
    }
    sendHttpRequest(`http://localhost:8000/notifications/list/`, 'GET')
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
        setInit(data);
      });
  }, [router]);
  const popover = usePopover();
  const { handleRemoveOne, handleMarkAllAsRead, notifications, unread } =
    useNotifications(initNotifications);

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          ref={popover.anchorRef}
          onClick={popover.handleOpen}
        >
          <Badge
            color="error"
            badgeContent={unread}
          >
            <SvgIcon>
              <Bell01Icon />
            </SvgIcon>
          </Badge>
        </IconButton>
      </Tooltip>
      <NotificationsPopover
        anchorEl={popover.anchorRef.current}
        notifications={notifications}
        onClose={popover.handleClose}
        onMarkAllAsRead={handleMarkAllAsRead}
        onRemoveOne={handleRemoveOne}
        open={popover.open}
      />
    </>
  );
};
