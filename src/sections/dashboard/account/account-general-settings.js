import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import { useCallback, useEffect, useState } from 'react';
import sendHttpRequest from 'src/utils/send-http-request';
import { FormControl, FormHelperText, InputLabel, Select } from '@mui/material';
import { fileToBase64 } from 'src/utils/file-to-base64';
import confetti from 'canvas-confetti';
import { AvatarDropzone } from 'src/components/avatar-dropzone';
import Avatar from '@mui/material/Avatar';

import { useRouter } from 'next/navigation';

export const AccountGeneralSettings = (props) => {
  const { userData } = props;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');

  const mockPassword = '123456789#';
  const [password, setPassword] = useState(mockPassword);
  const passwordData = { password: password, sports_data: '' };
  const [errorMessage, setErrorMessage] = useState({ error: false, message: '' });
  const [changed, setChanged] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setChanged(true);
  };
  function handlePasswordClick() {
    setLoading(true);
    passwordData.sports_data =
      '[' + values.sports_data.map((item) => '"' + item + '"').join(', ') + ']';
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
  const handleEditClick = () => {
    // Enable editing
    setIsEditing(true);
    setPassword('');
  };
  const handleSaveClick = () => {
    // Enable editing
    setIsEditing(false);
    if (changed) {
      setChanged(false);
      handlePasswordClick();
      setPassword(mockPassword);
    }
  };

  const [values, setValues] = useState({
    avatar_data: null,
    email: '',
    age: '',
    phone_no: '',
    username: '',
    sports_data: [],
    gender: '',
    description: '',
  });

  useEffect(() => {
    const sports_name = [];
    if (userData.sports_data) {
      for (let i = 0; i < userData.sports_data.length; i++) {
        sports_name.push(userData.sports_data[i]['name']);
      }
    }
    setValues({
      avatar_data: userData.avatar_data,
      email: userData.email,
      age: userData.age,
      phone_no: userData.phone_no,
      username: userData.username,
      sports_data: sports_name,
      gender: userData.gender ? userData.gender : 'Prefer not to say',
      description: userData.description ? userData.description : '',
    });
  }, [userData]);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const [profileError, setProfileError] = useState({
    avatar_data: { error: false, message: '' },
    email: { error: false, message: '' },
    age: { error: false, message: '' },
    phone_no: { error: false, message: '' },
    username: { error: false, message: '' },
    sports_data: { error: false, message: '' },
    gender: { error: false, message: '' },
    description: { error: false, message: '' },
  });
  const isSportSelected = (sport) => values.sports_data.includes(sport);
  const sportsOptions = [
    'Soccer',
    'Football',
    'Basketball',
    'Baseball',
    'Tennis',
    'Volleyball',
    'Badminton',
    'Skiing',
    'Swimming',
    'Running',
  ];
  const sportsRows = Array.from({ length: 2 }, (_, rowIndex) =>
    sportsOptions.slice(rowIndex * 5, (rowIndex + 1) * 5)
  );

  function validateProfile() {
    const isNameEmpty = values.username === '';
    const isEmailEmpty = values.email === '';
    const isInvaildPhone = !(values.phone_no === '' || /^\d{10}$/.test(values.phone_no));
    const isInvaildAge =
      !(values.age === '' || /^\d+$/.test(values.age)) ||
      parseInt(values.age) < 0 ||
      parseInt(values.age) > 200;
    const isUnknownGender = !['Prefer not to say', 'Male', 'Female', 'Other'].includes(
      values.gender
    );
    const isDescriptionTooLong = values.description && values.description.length > 300;
    if (values.avatar_data && values.avatar_data.startsWith('http')) {
      delete values.avatar_data;
    }

    setProfileError({
      ...profileError,
      username: {
        error: isNameEmpty,
        message: isNameEmpty ? 'Name is required' : '',
      },
      email: {
        error: isEmailEmpty,
        message: isEmailEmpty ? 'Email is required' : '',
      },
      age: {
        error: isInvaildAge,
        message: isInvaildAge ? 'Invaild age.' : '',
      },
      phone_no: {
        error: isInvaildPhone,
        message: isInvaildPhone
          ? 'Invalid phone number. Please enter a 10-digits phone number'
          : '',
      },
      gender: {
        error: isUnknownGender,
        message: isUnknownGender ? 'Unknown gender type' : '',
      },
      description: {
        error: isDescriptionTooLong,
        message: isDescriptionTooLong ? 'Description should be under 300 charactors' : '',
      },
    });

    return (
      !isNameEmpty &&
      !isEmailEmpty &&
      !isInvaildPhone &&
      !isUnknownGender &&
      !isInvaildAge &&
      !isDescriptionTooLong
    );
  }

  function handleClick() {
    setLoading(true);
    if (validateProfile()) {
      const copyData = { ...values };
      copyData.sports_data =
        '[' + values.sports_data.map((item) => '"' + item + '"').join(', ') + ']';
      sendHttpRequest('http://localhost:8000/accounts/editprofile/', 'PATCH', copyData).then(
        (response) => {
          if (response.status === 200 || response.status === 201) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
            setSeverity('success');
            setMessage('User profile update successfully');
            setOpen(true);
          } else if (response.status === 400) {
            setSeverity('warning');
            setMessage('Please fill in all the required fields in proper format');
            setOpen(true);
          } else if (response.status === 401) {
            router.push('/401');
          } else {
            setSeverity('error');
            setMessage('An unexpected error occurred: ' + JSON.stringify(response.data));
            setOpen(true);
          }
        }
      );
    }
    setLoading(false);
  }

  function handleSportClick() {
    setLoading(true);
    if (validateProfile()) {
      const sports_string =
        '[' + values.sports_data.map((item) => '"' + item + '"').join(', ') + ']';
      const copyData = { sports_data: sports_string };
      sendHttpRequest('http://localhost:8000/accounts/editprofile/', 'PATCH', copyData).then(
        (response) => {
          if (response.status === 200 || response.status === 201) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
            setSeverity('success');
            setMessage('User profile update successfully');
            setOpen(true);
          } else if (response.status === 400) {
            setSeverity('warning');
            setMessage('Please fill in all the required fields in proper format');
            setOpen(true);
          } else if (response.status === 401) {
            router.push('/401');
          } else {
            setSeverity('error');
            setMessage('An unexpected error occurred: ' + JSON.stringify(response.data));
            setOpen(true);
          }
        }
      );
    }
    setLoading(false);
  }

  const onSportsChange = (sport) => {
    if (values.sports_data.includes(sport)) {
      values.sports_data.splice(values.sports_data.indexOf(sport), 1);
    } else {
      values.sports_data.push(sport);
    }
    handleSportClick();
  };

  const handleAvatarDrop = useCallback(
    async ([file]) => {
      const data = await fileToBase64(file);
      setValues({ ...values, avatar_data: data }); // directly assign the data to values.avatar
    },
    [values]
  );

  const handleAvatarRemove = useCallback(() => {
    setValues({ ...values, avatar_data: null });
  }, [values]);

  return (
    <Stack
      spacing={4}
      {...props}
    >
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
              <Typography variant="h6">Basic details</Typography>
            </Grid>
            <Grid
              xs={12}
              md={8}
            >
              <Stack spacing={3}>
                <FormControl fullWidth>
                  <Stack
                    spacing={3}
                    direction={'row'}
                    alignItems={'flex-start'}
                  >
                    <Stack>
                      <Avatar
                        sx={{
                          height: 300,
                          width: 300,
                        }}
                        src={values.avatar_data}
                      ></Avatar>

                      <Button
                        color="inherit"
                        disabled={!values.avatar_data}
                        onClick={handleAvatarRemove}
                      >
                        Remove
                      </Button>
                    </Stack>

                    <AvatarDropzone
                      accept={{ 'image/*': [] }}
                      maxFiles={1}
                      onDrop={handleAvatarDrop}
                      caption="(SVG, JPG, PNG, or gif maximum 900x400)"
                    />
                  </Stack>
                  {profileError.avatar_data.error && (
                    <FormHelperText error>{profileError.avatar_data.message}</FormHelperText>
                  )}
                </FormControl>

                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <FormControl fullWidth>
                    <TextField
                      id={'username'}
                      name={'username'}
                      value={values.username}
                      onChange={handleChange}
                      label="Username"
                      error={profileError.username.error}
                      required
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dashed',
                        },
                      }}
                    />
                    {profileError.username.error && (
                      <FormHelperText error>{profileError.username.message}</FormHelperText>
                    )}
                  </FormControl>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <FormControl fullWidth>
                    <TextField
                      id={'email'}
                      name={'email'}
                      value={values.email}
                      onChange={handleChange}
                      label="Email Address"
                      error={profileError.email.error}
                      required
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dashed',
                        },
                      }}
                    />
                    {profileError.email.error && (
                      <FormHelperText error>{profileError.email.message}</FormHelperText>
                    )}
                  </FormControl>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <FormControl fullWidth>
                    <TextField
                      id={'phone_no'}
                      name={'phone_no'}
                      error={profileError.phone_no.error}
                      value={values.phone_no}
                      onChange={handleChange}
                      label="Phone Number"
                      inputProps={{ maxLength: 10 }}
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dashed',
                        },
                      }}
                    />
                    {profileError.phone_no.error && (
                      <FormHelperText error>{profileError.phone_no.message}</FormHelperText>
                    )}
                  </FormControl>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <FormControl fullWidth>
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                      labelId="gender-label"
                      id={'gender'}
                      name={'gender'}
                      error={profileError.gender.error}
                      value={values.gender}
                      onChange={handleChange}
                      label="Gender"
                      required
                    >
                      <MenuItem value={'Male'}>Male</MenuItem>
                      <MenuItem value={'Female'}>Female</MenuItem>
                      <MenuItem value={'Other'}>Other</MenuItem>
                      <MenuItem value={'Prefer not to say'}>Prefer not to say</MenuItem>
                    </Select>
                    {profileError.gender.error && (
                      <FormHelperText error>{profileError.gender.message}</FormHelperText>
                    )}
                  </FormControl>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <FormControl fullWidth>
                    <TextField
                      id={'age'}
                      name={'age'}
                      error={profileError.age.error}
                      value={values.age}
                      onChange={handleChange}
                      label="Age"
                      type="number"
                      inputProps={{ maxLength: 2 }}
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dashed',
                        },
                      }}
                    />
                    {profileError.age.error && (
                      <FormHelperText error>{profileError.age.message}</FormHelperText>
                    )}
                  </FormControl>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <FormControl fullWidth>
                    <TextField
                      id={'description'}
                      name={'description'}
                      error={profileError.description.error}
                      value={values.description}
                      onChange={handleChange}
                      inputProps={{ maxLength: 300 }}
                      label="Description"
                      multiline
                      rows={3}
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dashed',
                        },
                      }}
                    />
                    {profileError.description.error && (
                      <FormHelperText error>{profileError.description.message}</FormHelperText>
                    )}
                  </FormControl>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  justifyContent="flex-end"
                >
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleClick}
                  >
                    Save
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
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
              <Typography variant="h6"> Sports you can play</Typography>
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
                  direction="column"
                  spacing={2}
                >
                  {sportsRows.map((row, rowIndex) => (
                    <Stack
                      key={rowIndex}
                      direction="row"
                      spacing={2}
                    >
                      {row.map((sport) => (
                        <Chip
                          key={sport}
                          label={sport}
                          color={isSportSelected(sport) ? 'primary' : 'default'}
                          onClick={() => onSportsChange(sport)}
                        />
                      ))}
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={4}
            >
              <Typography variant="h6">Public profile</Typography>
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
                    <Typography variant="subtitle1">Make Contact Info Public</Typography>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      Means that anyone viewing your profile will be able to see your contacts
                      details.
                    </Typography>
                  </Stack>
                  <Switch
                    id={'publicProfile'}
                    name={'publicProfile'}
                    value={values.publicProfile}
                    onChange={handleClick}
                  />
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card> */}
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
                    type={!isEditing ? 'password' : 'text'}
                    value={password}
                    error={errorMessage.error}
                    onChange={handlePasswordChange}
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

AccountGeneralSettings.propTypes = {
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};
