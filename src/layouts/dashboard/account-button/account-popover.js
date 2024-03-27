import { useCallback } from 'react';
import PropTypes from 'prop-types';
// import toast from 'react-hot-toast';
import User03Icon from '@untitled-ui/icons-react/build/esm/User03';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddBoxIcon from '@mui/icons-material/AddBox';

import { RouterLink } from 'src/components/router-link';
// import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'src/hooks/use-router';
import { paths } from 'src/paths';
// import { Issuer } from 'src/utils/auth';

export const AccountPopover = (props) => {
  const { userData, anchorEl, onClose, open, ...other } = props;
  const router = useRouter();
  // const auth = useAuth();

  // const handleLogout = useCallback(async () => {
  //   try {
  //     onClose?.();

  //     switch (auth.issuer) {
  //       case Issuer.Amplify: {
  //         await auth.signOut();
  //         break;
  //       }

  //       case Issuer.Auth0: {
  //         await auth.logout();
  //         break;
  //       }

  //       case Issuer.Firebase: {
  //         await auth.signOut();
  //         break;
  //       }

  //       case Issuer.JWT: {
  //         await auth.signOut();
  //         break;
  //       }

  //       default: {
  //         console.warn('Using an unknown Auth Issuer, did not log out');
  //       }
  //     }

  //     router.push(paths.index);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error('Something went wrong!');
  //   }
  // }, [auth, router, onClose]);

  const handleLogout = () => {
    if (localStorage.getItem('JWT') !== null) {
      localStorage.removeItem('JWT');
      router.push('/login');
    }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom',
      }}
      disableScrollLock
      onClose={onClose}
      open={!!open}
      PaperProps={{ sx: { width: 200 } }}
      {...other}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">{userData.username}</Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {userData.email}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 1 }}>
        <ListItemButton
          component={RouterLink}
          href={paths.dashboard.account}
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <User03Icon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary={<Typography variant="body1">Edit</Typography>} />
        </ListItemButton>
        <ListItemButton
          component={RouterLink}
          href={paths.dashboard.index}
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <DashboardIcon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary={<Typography variant="body1">Dashboard</Typography>} />
        </ListItemButton>
        <ListItemButton
          component={RouterLink}
          href={paths.dashboard.room.roomCreate}
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <AddBoxIcon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary={<Typography variant="body1">Create Room</Typography>} />
        </ListItemButton>
        <ListItemButton
          component={RouterLink}
          href={paths.index}
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <ManageSearchIcon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary={<Typography variant="body1">Search</Typography>} />
        </ListItemButton>
      </Box>
      <Divider sx={{ my: '0 !important' }} />
      <Box sx={{ p: 1 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <LogoutIcon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary={<Typography variant="body1">Logout</Typography>} />
        </ListItemButton>
      </Box>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
