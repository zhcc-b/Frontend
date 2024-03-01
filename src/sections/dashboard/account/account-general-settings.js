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
import { useCallback, useEffect, useState, Fragment } from 'react';
import sendHttpRequest from 'src/utils/send-http-request';
import { FormControl, FormHelperText, InputLabel, Select } from '@mui/material';
import { fileToBase64 } from 'src/utils/file-to-base64';
import confetti from 'canvas-confetti';
import { AvatarDropzone } from 'src/components/avatar-dropzone';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/navigation';

export const AccountGeneralSettings = (props) => {
  const { init_avatar, userData } = props;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');
  const [avatar, setAvatar] = useState(init_avatar);
  const router = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
    // birthday: { error: false, message: '' },
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
    const isPhoneEmpty = values.phone_no === '';
    const isAgeEmpty = values.age === '';
    // const isBirthdayEmpty = values.birthday === null;
    const isGenderEmpty = values.gender === null;
    const isAvatarEmpty = values.avatar_data === '';

    // const isInvaildphone_no = !/^\d{10}$/.test(values.phone_no);
    const isInvaildAge =
      !/^\d+$/.test(values.age) || parseInt(values.age) < 0 || parseInt(values.age) > 200;
    const isUnknownGender = !['Prefer not to say', 'Male', 'Female', 'Other'].includes(
      values.gender
    );
    const isDescriptionTooLong = values.description && values.description.length > 300;
    // const isNotBirthdayObject = !values.birthday instanceof Date;
    // const isInvaildBirthday = values.birthday > today;
    if (values.avatar_data && values.avatar_data.startsWith('http')) {
      delete values.avatar_data;
    }

    setProfileError({
      ...profileError,
      avatar_data: {
        error: isAvatarEmpty,
        message: isAvatarEmpty ? 'Avatar image is required' : '',
      },
      username: {
        error: isNameEmpty,
        message: isNameEmpty ? 'Name is required' : '',
      },
      email: {
        error: isEmailEmpty,
        message: isEmailEmpty ? 'Email is required' : '',
      },
      age: {
        error: isAgeEmpty || isInvaildAge,
        message: isAgeEmpty ? 'Age is required' : isInvaildAge ? 'Invaild age.' : '',
      },
      phone_no: {
        error: isPhoneEmpty,
        message: isPhoneEmpty ? 'phone_no number is required' : '',
      },
      // birthday: {
      //   error: isBirthdayEmpty || isNotBirthdayObject || isInvaildBirthday,
      //   message: isBirthdayEmpty
      //     ? 'Birthday is required'
      //     : isNotBirthdayObject
      //     ? 'Invalid birthday data'
      //     : isInvaildBirthday
      //     ? 'Birthday must before today'
      //     : '',
      // },
      gender: {
        error: isGenderEmpty || isUnknownGender,
        message: isGenderEmpty
          ? 'Gender is required'
          : isUnknownGender
          ? 'Unknown gender type'
          : '',
      },
      description: {
        error: isDescriptionTooLong,
        message: isDescriptionTooLong ? 'Description should be under 300 charactors' : '',
      },
    });

    return (
      !isNameEmpty &&
      !isEmailEmpty &&
      !isPhoneEmpty &&
      !isAgeEmpty &&
      !isGenderEmpty &&
      // !isInvaildphone_no &&
      !isUnknownGender &&
      !isInvaildAge &&
      !isDescriptionTooLong
      // !isAvatarEmpty
    );
  }

  function handleClick() {
    setLoading(true);
    if (validateProfile()) {
      const copyData = { ...values };
      // const sportString = JSON.stringify(values.sports_data);
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
  function handleDeleteClick() {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (isConfirmed) {
      setLoading(true);
      sendHttpRequest('http://localhost:8000/accounts/editprofile/', 'DELETE').then((response) => {
        if (response.status === 200 || response.status === 201) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          setSeverity('success');
          setMessage('Successfully delete account');
          setOpen(true);
        } else if (response.status === 401) {
          router.push('/401');
        } else {
          setSeverity('error');
          setMessage('An unexpected error occurred: ' + JSON.stringify(response.data));
          setOpen(true);
        }
      });
      setLoading(false);
    }
  }

  const onSportsChange = (sport) => {
    if (values.sports_data.includes(sport)) {
      values.sports_data.splice(values.sports_data.indexOf(sport), 1);
    } else {
      values.sports_data.push(sport);
    }
    handleClick();
  };

  const handleCoverDrop = useCallback(
    async ([file]) => {
      const data = await fileToBase64(file);
      setAvatar(data);
      values.avatar_data = data; // directly assign the data to formData.attachment
    },
    [values]
  );

  const handleCoverRemove = useCallback(() => {
    setAvatar(null);
    values.avatar_data = null;
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
                <Stack
                  spacing={3}
                  direction={'row'}
                  alignItems={'flex-start'}
                >
                  <Stack>
                    {avatar ? (
                      <Box
                        sx={{
                          backgroundImage: `url(${avatar})`,
                          backgroundPosition: 'center',
                          alignItems: 'center',
                          backgroundSize: 'avatar',
                          borderRadius: '50%',
                          height: 300,
                          width: 300,
                          mt: 3,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          border: 1,
                          borderRadius: '50%',
                          borderStyle: 'dashed',
                          borderColor: 'grey.500',
                          height: 300,
                          width: 300,
                          mt: 3,
                        }}
                      >
                        <Typography
                          align="center"
                          color="text.secondary"
                          variant="h6"
                        >
                          Avatar Preview
                        </Typography>
                      </Box>
                    )}
                    <Button
                      color="inherit"
                      disabled={!avatar}
                      onClick={handleCoverRemove}
                    >
                      Remove
                    </Button>
                  </Stack>

                  <AvatarDropzone
                    accept={{ 'image/*': [] }}
                    maxFiles={1}
                    onDrop={handleCoverDrop}
                    caption="(SVG, JPG, PNG, or gif maximum 900x400)"
                  />
                </Stack>

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
                      required
                      type="number"
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
                  <TextField
                    id={'age'}
                    name={'age'}
                    value={values.age}
                    onChange={handleChange}
                    error={profileError.age.error}
                    required
                    type="number"
                    label="Age"
                    sx={{ flexGrow: 1 }}
                  />
                </Stack>
                {/* <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <DatePicker
                    label="Birthday"
                    disabled={!isEditBirth}
                    onChange={handleChange}
                    value={values.birthday}
                    maxDate={today}
                    required
                  />
                  {isEditBirth ? (
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleBirthSaveClick}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleBirthEditClick}
                    >
                      Edit
                    </Button>
                  )}
                </Stack> */}
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
              <Typography variant="h6">Delete Account</Typography>
              <Fragment>
                <Button
                  variant="outlined"
                  onClick={handleClickOpen}
                >
                  Open alert dialog
                </Button>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Use Google's location service?"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Let Google help apps determine location. This means sending anonymous location
                      data to Google, even when no apps are running.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button
                      onClick={handleClose}
                      autoFocus
                    >
                      Agree
                    </Button>
                  </DialogActions>
                </Dialog>
              </Fragment>
            </Grid>
            <Grid
              xs={12}
              md={8}
            >
              <Stack
                alignItems="flex-start"
                spacing={3}
              >
                <Typography variant="subtitle1">
                  Delete your account and all of your source data. This is irreversible.
                </Typography>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={handleDeleteClick}
                >
                  Delete account
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card> */}
    </Stack>
  );
};

AccountGeneralSettings.propTypes = {
  email: PropTypes.string.isRequired,
};
