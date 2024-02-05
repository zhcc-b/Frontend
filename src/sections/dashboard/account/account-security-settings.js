import { useCallback, useState } from 'react';
// import PropTypes from 'prop-types';
// import { format } from 'date-fns';
// import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
// import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
// import SvgIcon from '@mui/material/SvgIcon';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import sendHttpRequest from 'src/utils/send-http-request';
import useUserInput from 'src/hooks/use-user-input';

// import { Scrollbar } from 'src/components/scrollbar';

export const AccountSecuritySettings = (props) => {
  const { password } = props;
  const [passwordData, handleInputChange] = useUserInput({ password: password });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');

  const handleEditClick = () => {
    // Enable editing
    setIsEditing(true);
  };
  const handleSaveClick = () => {
    // Enable editing
    setIsEditing(false);
    handleClick();
  };

  function handleClick() {
    setLoading(true);
    sendHttpRequest('http://localhost:8000/userprofile/edit-profile/', 'POST', passwordData).then(
      (response) => {
        if (response.status === 200) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          setSeverity('success');
          setMessage('User data updated successfully');
          setOpen(true);
        } else if (response.status === 400) {
          setSeverity('warning');
          setMessage('Please fill in all the required fields');
          setOpen(true);
        } else {
          setSeverity('error');
          setMessage('An unexpected error occurred: ' + response.data);
          setOpen(true);
        }
      }
    );

    setLoading(false);
  }
  return (
    <Stack spacing={4}>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={4}
            >
              <Typography variant="h6">Change password</Typography>
            </Grid>
            <Grid
              xs={12}
              sm={12}
              md={8}
            >
              <Stack
                alignItems="center"
                direction="row"
                spacing={3}
              >
                <TextField
                  id="password"
                  name="password"
                  disabled={!isEditing}
                  label="Password"
                  type="password"
                  value={passwordData.password}
                  onChange={handleInputChange}
                  sx={{
                    flexGrow: 1,
                    ...(!isEditing && {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderStyle: 'dotted',
                      },
                    }),
                  }}
                />
                {isEditing ? (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleSaveClick}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleEditClick}
                  >
                    Edit
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* <Card>
        <CardHeader title="Multi Factor Authentication" />
        <CardContent sx={{ pt: 0 }}>
          <Grid
            container
            spacing={4}
          >
            <Grid
              xs={12}
              sm={6}
            >
              <Card
                sx={{ height: '100%' }}
                variant="outlined"
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'block',
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        '&::before': {
                          backgroundColor: 'error.main',
                          borderRadius: '50%',
                          content: '""',
                          display: 'block',
                          height: 8,
                          left: 4,
                          position: 'absolute',
                          top: 7,
                          width: 8,
                          zIndex: 1,
                        },
                      }}
                    >
                      <Typography
                        color="error"
                        sx={{ pl: 3 }}
                        variant="body2"
                      >
                        Off
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    sx={{ mt: 1 }}
                    variant="subtitle2"
                  >
                    Authenticator App
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1 }}
                    variant="body2"
                  >
                    Use an authenticator app to generate one time security codes.
                  </Typography>
                  <Box sx={{ mt: 4 }}>
                    <Button
                      endIcon={
                        <SvgIcon>
                          <ArrowRightIcon />
                        </SvgIcon>
                      }
                      variant="outlined"
                    >
                      Set Up
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              sm={6}
              xs={12}
            >
              <Card
                sx={{ height: '100%' }}
                variant="outlined"
              >
                <CardContent>
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      sx={{
                        '&::before': {
                          backgroundColor: 'error.main',
                          borderRadius: '50%',
                          content: '""',
                          display: 'block',
                          height: 8,
                          left: 4,
                          position: 'absolute',
                          top: 7,
                          width: 8,
                          zIndex: 1,
                        },
                      }}
                    >
                      <Typography
                        color="error"
                        sx={{ pl: 3 }}
                        variant="body2"
                      >
                        Off
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    sx={{ mt: 1 }}
                    variant="subtitle2"
                  >
                    Text Message
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1 }}
                    variant="body2"
                  >
                    Use your mobile phone to receive security codes via SMS.
                  </Typography>
                  <Box sx={{ mt: 4 }}>
                    <Button
                      endIcon={
                        <SvgIcon>
                          <ArrowRightIcon />
                        </SvgIcon>
                      }
                      variant="outlined"
                    >
                      Set Up
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          title="Login history"
          subheader="Your recent login activity"
        />
        <Scrollbar>
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow>
                <TableCell>Login type</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Client</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loginEvents.map((event) => {
                const createdAt = format(event.createdAt, 'HH:mm a MM/dd/yyyy');

                return (
                  <TableRow
                    key={event.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="subtitle2">{event.type}</Typography>
                      <Typography
                        variant="body2"
                        color="body2"
                      >
                        on {createdAt}
                      </Typography>
                    </TableCell>
                    <TableCell>{event.ip}</TableCell>
                    <TableCell>{event.userAgent}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Scrollbar>
      </Card> */}
    </Stack>
  );
};

// AccountSecuritySettings.propTypes = {
//   loginEvents: PropTypes.array.isRequired,
// };
