import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import useUserInput from 'src/hooks/use-user-input';
import sendHttpRequest from 'src/utils/send-http-request';

export const AccountNotificationsSettings = (props) => {
  const { email_product, email_security, phone_security } = props;
  const [loading, setLoading] = useState(false);
  const [notificationData, handleInputChange] = useUserInput({
    email_product: email_product,
    email_security: email_security,
    phone_security: phone_security,
  });
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');
  function handleClick() {
    setLoading(true);
    sendHttpRequest('http://localhost:3000/api/edit-profile', 'POST', notificationData).then(
      (response) => {
        if (response.status === 200) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          setSeverity('success');
          setMessage('Matching room created successfully');
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
  }
  return (
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
            <Typography variant="h6">Email</Typography>
          </Grid>
          <Grid
            xs={12}
            sm={12}
            md={8}
          >
            <Stack
              divider={<Divider />}
              spacing={3}
            >
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={3}
              >
                <Stack spacing={1}>
                  <Typography variant="subtitle1">Product updates</Typography>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    News, announcements, and product updates.
                  </Typography>
                </Stack>
                <Switch
                  id={'email_product'}
                  name={'email_product'}
                  value={email_product}
                  onChange={handleInputChange}
                  onClick={handleClick}
                />
              </Stack>
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={3}
              >
                <Stack spacing={1}>
                  <Typography variant="subtitle1">Security updates</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Important notifications about your account security.
                  </Typography>
                </Stack>
                <Switch
                  id={'email_security'}
                  name={'email_security'}
                  value={email_security}
                  onChange={handleInputChange}
                  onClick={handleClick}
                />
              </Stack>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
            md={4}
          >
            <Typography variant="h6">Phone notifications</Typography>
          </Grid>
          <Grid
            xs={12}
            sm={12}
            md={8}
          >
            <Stack
              divider={<Divider />}
              spacing={3}
            >
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={3}
              >
                <Stack spacing={1}>
                  <Typography variant="subtitle1">Security updates</Typography>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    Important notifications about your account security.
                  </Typography>
                </Stack>
                <Switch
                  id={'phone_security'}
                  name={'phone_security'}
                  value={phone_security}
                  onChange={handleInputChange}
                  onClick={handleClick}
                />
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
