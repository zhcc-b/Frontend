import { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import sendHttpRequest from 'src/utils/send-http-request';
import confetti from 'canvas-confetti';
import { FormControl } from '@mui/material';

export const AccountSecuritySettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');
  const mockPassword = '123456789#';
  const [password, setPassword] = useState(mockPassword);
  const [changed, setChanged] = useState(false);

  const handleChange = (event) => {
    setPassword(event.target.value);
    setChanged(true);
  };
  const handleEditClick = () => {
    // Enable editing
    setIsEditing(true);
  };
  const handleSaveClick = () => {
    // Enable editing
    setIsEditing(false);
    if (changed) {
      setChanged(false);
      handleClick();
      setPassword(mockPassword);
    }
  };

  const passwordData = { password: password };
  const [errorMessage, setErrorMessage] = useState({ error: false, message: '' });

  function handleClick() {
    setLoading(true);
    sendHttpRequest('http://localhost:8000/accounts/editprofile/', 'PATCH', passwordData).then(
      (response) => {
        if (response.status === 200 || response.status === 201) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          setSeverity('success');
          setMessage('User data updated successfully');
          setOpen(true);
        } else if (response.status === 400) {
          setErrorMessage({ error: true, message: response.data.password });
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
                <FormControl fullWidth>
                  <TextField
                    id="password"
                    name="password"
                    disabled={!isEditing}
                    label="Password"
                    type="password"
                    value={password}
                    onChange={handleChange}
                    sx={{
                      flexGrow: 1,
                      ...(!isEditing && {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dotted',
                        },
                      }),
                    }}
                  />
                  {errorMessage.error && (
                    <FormHelperText error>{errorMessage.message}</FormHelperText>
                  )}
                </FormControl>

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
    </Stack>
  );
};
