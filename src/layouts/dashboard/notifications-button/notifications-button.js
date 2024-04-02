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
import { formatDateTime } from 'src/utils/format-datetime';
import { Button } from '@mui/material';

export const NotificationsButton = () => {
  const [numUnread, setUnread] = useState(0);
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrent] = useState(null);
  const [nextPage, setNext] = useState(null);
  const [previousPage, setPrevious] = useState(null);
  let pageNum = 1;

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
        setUnread(data['unread']);
        setNotifications(data['results']);
        setCurrent('http://localhost:8000/notifications/list/?page=1');
        setNext(data['next']);
        setPrevious(data['previous']);
      });
  }, [router]);

  const popover = usePopover();
  const handleNextClick = () => {
    pageNum += 1;
    if (router.isReady === false) {
      return;
    }
    sendHttpRequest(nextPage, 'GET')
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
        setCurrent(nextPage);
        setNotifications(data['results']);
        setNext(data['next']);
        setPrevious(data['previous']);
      });
  };
  const handlePreviousClick = () => {
    pageNum -= 1;
    if (router.isReady === false) {
      return;
    }
    sendHttpRequest(previousPage, 'GET')
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
        setCurrent(previousPage);
        setNotifications(data['results']);
        setNext(data['next']);
        setPrevious(data['previous']);
      });
  };
  const handleDeleteNotification = (notificationId) => {
    if (router.isReady === false) {
      return;
    }
    sendHttpRequest(`http://localhost:8000/notifications/delete/`, 'DELETE', {
      id: notificationId,
    }).then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response.data;
      } else if (response.status === 401 || response.status === 403) {
        router.push('/401');
      } else if (response.status === 404) {
        router.push('/404');
      } else {
        router.push('/500');
      }
    });
    sendHttpRequest(currentPage, 'GET')
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
        setNotifications(data['results']);
        setNext(data['next']);
        setPrevious(data['previous']);
      });
  };

  const handleReadNotification = (notification) => {
    if (!notification.read) {
      if (router.isReady === false) {
        return;
      }
      sendHttpRequest('http://localhost:8000/notifications/read/', 'PATCH', {
        id: notification.id,
      }).then((response) => {
        if (response.status === 200 || response.status === 201) {
          return response.data;
        } else if (response.status === 401 || response.status === 403) {
          router.push('/401');
        } else if (response.status === 404) {
          router.push('/404');
        } else {
          router.push('/500');
        }
      });
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
          setUnread(data['unread']);
          setNotifications(data['results']);
          setCurrent('http://localhost:8000/notifications/list/?page=1');
          setNext(data['next']);
          setPrevious(data['previous']);
        });
    }
  };
  const isEmpty = pageNum === 1 && notifications.length === 0;

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
      <Popover
        anchorEl={popover.anchorRef.current}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
        disableScrollLock
        onClose={popover.handleClose}
        open={popover.open}
        PaperProps={{
          style: {
            width: '400px',
          },
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            px: 3,
            py: 2,
          }}
        >
          <Typography
            color="inherit"
            variant="h6"
          >
            Notifications
          </Typography>
        </Stack>
        {isEmpty ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2">There are no notifications</Typography>
          </Box>
        ) : (
          <Scrollbar sx={{ maxHeight: 400 }}>
            <List disablePadding>
              {notifications.map((notification) => (
                <ListItem
                  divider
                  key={notification.id}
                  sx={{
                    alignItems: 'flex-start',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    '& .MuiListItemSecondaryAction-root': {
                      top: '24%',
                    },
                  }}
                  // secondaryAction={
                  //   <Tooltip title="Remove">
                  //     <IconButton
                  //       edge="end"
                  //       onClick={() => handleDeleteNotification(notification.id)}
                  //       size="small"
                  //     >
                  //       <SvgIcon>
                  //         <XIcon />
                  //       </SvgIcon>
                  //     </IconButton>
                  //   </Tooltip>
                  // }
                  onClick={() => handleReadNotification(notification)}
                  alignItems="flex-start"
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          flexWrap: 'wrap',
                        }}
                      >
                        <Link
                          href={`http://localhost:3000/room/${notification.event_id}`}
                          underline="always"
                          variant="body1"
                        >
                          {notification.event_title}
                        </Link>
                        <Typography
                          variant="body2"
                          width="100%"
                        >
                          {notification.description}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        color="text.secondary"
                        variant="caption"
                      >
                        {formatDateTime(notification.created_at)}
                      </Typography>
                    }
                    sx={{ my: 0 }}
                  />
                </ListItem>
              ))}
            </List>
            <Stack
              direction="row"
              width="100%"
            >
              <Button
                onClick={handlePreviousClick}
                disabled={previousPage === null}
                sx={{ width: '50%', borderRadius: '0' }}
              >
                {'<'}
              </Button>
              <Button
                onClick={handleNextClick}
                disabled={nextPage === null}
                sx={{ width: '50%', borderRadius: '0' }}
              >
                {'>'}
              </Button>
            </Stack>
          </Scrollbar>
        )}
      </Popover>
    </>
  );
};
