import PropTypes from 'prop-types';
import Camera01Icon from '@untitled-ui/icons-react/build/esm/Camera01';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import { alpha } from '@mui/system/colorManipulator';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import useUserInput from 'src/hooks/use-user-input';
import sendHttpRequest from 'src/utils/send-http-request';
import { FormControl, FormHelperText, InputLabel, Select } from '@mui/material';

export const AccountGeneralSettings = (props) => {
  const { avatar, email, phone, name, sports, age, gender, description } = props;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');
  const [userData, handleInputChange] = useUserInput({
    avatar: avatar,
    email: email,
    phone: phone,
    name: name,
    sports: sports,
    age: age,
    // birthday: null,
    gender: gender,
    description: description,
    publicProfile: false,
  });

  const [profileError, setProfileError] = useState({
    email: { error: false, message: '' },
    age: { error: false, message: '' },
    phone: { error: false, message: '' },
    name: { error: false, message: '' },
    sports: { error: false, message: '' },
    birthday: { error: false, message: '' },
    gender: { error: false, message: '' },
    description: { error: false, message: '' },
  });
  const isSportSelected = (sport) => userData.sports.includes(sport);
  const sportsOptions = [
    'Soccer',
    'Football',
    'Basketball',
    'Baseball',
    'Tennis',
    'Volleyball',
    'Badminton',
    'Swimming',
    'Running',
  ];
  const sportsRows = Array.from({ length: 2 }, (_, rowIndex) =>
    sportsOptions.slice(rowIndex * 5, (rowIndex + 1) * 5)
  );
  const today = new Date();

  function validateProfile() {
    const isNameEmpty = userData.name === '';
    const isEmailEmpty = userData.email === '';
    const isPhoneEmpty = userData.phone === '';
    const isAgeEmpty = userData.age === '';
    // const isBirthdayEmpty = userData.birthday === null;
    const isGenderEmpty = userData.gender === null;

    const isInvaildPhone = !/^\d{10}$/.test(userData.phone);
    const isInvaildAge =
      !/^\d+$/.test(userData.age) || parseInt(userData.age) < 0 || parseInt(userData.age) > 200;
    const isUnknownGender = !['Prefer not to say', 'Male', 'Female', 'Other'].includes(
      userData.gender
    );
    const isUnknownSport = !userData.sports.every((sport) => sportsOptions.includes(sport));
    const isDescriptionTooLong = userData.description.length > 300;

    // const isNotBirthdayObject = !userData.birthday instanceof Date;
    // const isInvaildBirthday = userData.birthday > today;

    setProfileError({
      ...profileError,
      name: {
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
      phone: {
        error: isPhoneEmpty || isInvaildPhone,
        message: isPhoneEmpty
          ? 'Phone number is required'
          : isInvaildPhone
          ? 'Invaild phone number'
          : '',
      },
      sports: {
        error: isUnknownSport,
        message: isUnknownSport ? 'Unknown sport type' : '',
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
      !isInvaildPhone &&
      !isUnknownGender &&
      !isUnknownSport &&
      !isInvaildAge &&
      !isDescriptionTooLong
    );
  }

  function handleClick() {
    setLoading(true);
    if (validateProfile()) {
      sendHttpRequest('http://localhost:8000/userprofile/edit-profile/', 'POST', userData).then(
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
    setLoading(false);
  }
  const [isEditEmail, setIsEditEmail] = useState(false);
  const handleEmailEditClick = () => {
    // Enable email editing
    setIsEditEmail(true);
  };

  const handleEmailSaveClick = () => {
    // Save the updated email and disable editing
    setIsEditEmail(false);
    handleClick();
  };
  const [isEditPhone, setIsEditPhone] = useState(false);
  const handlePhoneEditClick = () => {
    // Enable phone editing
    setIsEditPhone(true);
  };

  const handlePhoneSaveClick = () => {
    // Save the updated phone and disable editing
    setIsEditPhone(false);
    handleClick();
  };
  const [isEditGender, setIsEditGender] = useState(false);
  const handleGenderEditClick = () => {
    // Enable gender editing
    setIsEditGender(true);
  };

  const handleGenderSaveClick = () => {
    // Save the updated gender and disable editing
    setIsEditGender(false);
    handleClick();
  };
  // const [isEditBirth, setIsEditBirth] = useState(false);
  // const handleBirthEditClick = () => {
  //   // Enable birthday editing
  //   setIsEditBirth(true);
  // };

  // const handleBirthSaveClick = () => {
  //   // Save the updated birthday and disable editing
  //   setIsEditBirth(false);
  //   handleClick();
  // };
  const [isEditAge, setIsEditAge] = useState(false);
  const handleAgeEditClick = () => {
    // Enable age editing
    setIsEditAge(true);
  };

  const handleAgeSaveClick = () => {
    // Save the updated age and disable editing
    setIsEditAge(false);
    handleClick();
  };

  const onSportsChange = (sport) => {
    if (userData.sports.includes(sport)) {
      yourArray.splice(userData.sports.indexOf(sport), 1);
    } else {
      userData.sports.push(sport);
    }
    handleClick();
  };

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
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <Box
                    sx={{
                      borderColor: 'neutral.300',
                      borderRadius: '50%',
                      borderStyle: 'dashed',
                      borderWidth: 1,
                      p: '4px',
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: '50%',
                        height: '100%',
                        width: '100%',
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          alignItems: 'center',
                          backgroundColor: (theme) => alpha(theme.palette.neutral[700], 0.5),
                          borderRadius: '50%',
                          color: 'common.white',
                          cursor: 'pointer',
                          display: 'flex',
                          height: '100%',
                          justifyContent: 'center',
                          left: 0,
                          opacity: 0,
                          position: 'absolute',
                          top: 0,
                          width: '100%',
                          zIndex: 1,
                          '&:hover': {
                            opacity: 1,
                          },
                        }}
                      >
                        <Stack
                          alignItems="center"
                          direction="row"
                          spacing={1}
                        >
                          <SvgIcon color="inherit">
                            <Camera01Icon />
                          </SvgIcon>
                          <Typography
                            color="inherit"
                            variant="subtitle2"
                            sx={{ fontWeight: 700 }}
                          >
                            Select
                          </Typography>
                        </Stack>
                      </Box>
                      <Avatar
                        src={userData.avatar}
                        sx={{
                          height: 100,
                          width: 100,
                        }}
                      >
                        <SvgIcon>
                          <User01Icon />
                        </SvgIcon>
                      </Avatar>
                    </Box>
                  </Box>
                  <Button
                    color="inherit"
                    size="small"
                  >
                    Change
                  </Button>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <FormControl fullWidth>
                    <TextField
                      id={'name'}
                      name={'name'}
                      value={userData.name}
                      onChange={handleInputChange}
                      error={profileError.name.error}
                      required
                      label="Full Name"
                      sx={{ flexGrow: 1 }}
                    />
                    {profileError.name.error && (
                      <FormHelperText error>{profileError.name.message}</FormHelperText>
                    )}
                  </FormControl>
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleClick}
                  >
                    Save
                  </Button>
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
                      value={userData.email}
                      onChange={handleInputChange}
                      disabled={!isEditEmail}
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
                  {isEditEmail ? (
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleEmailSaveClick}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleEmailEditClick}
                    >
                      Edit
                    </Button>
                  )}
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <FormControl fullWidth>
                    <TextField
                      id={'phone'}
                      name={'phone'}
                      error={profileError.phone.error}
                      value={userData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditPhone}
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
                    {profileError.phone.error && (
                      <FormHelperText error>{profileError.phone.message}</FormHelperText>
                    )}
                  </FormControl>
                  {isEditPhone ? (
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handlePhoneSaveClick}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handlePhoneEditClick}
                    >
                      Edit
                    </Button>
                  )}
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
                      value={userData.gender}
                      onChange={handleInputChange}
                      label="Gender"
                      disabled={!isEditGender}
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
                  {isEditGender ? (
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleGenderSaveClick}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleGenderEditClick}
                    >
                      Edit
                    </Button>
                  )}
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <TextField
                    id={'age'}
                    name={'age'}
                    value={userData.age}
                    onChange={handleInputChange}
                    error={profileError.age.error}
                    required
                    type="number"
                    label="Age"
                    disabled={!isEditAge}
                    sx={{ flexGrow: 1 }}
                  />
                  {isEditAge ? (
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleAgeSaveClick}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleAgeEditClick}
                    >
                      Edit
                    </Button>
                  )}
                </Stack>
                {/* <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <DatePicker
                    label="Birthday"
                    disabled={!isEditBirth}
                    onChange={handleInputChange}
                    value={userData.birthday}
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
                      value={userData.description}
                      onChange={handleInputChange}
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
                    value={userData.publicProfile}
                    onChange={handleClick}
                  />
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
              <Typography variant="h6">Delete Account</Typography>
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
                >
                  Delete account
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};

AccountGeneralSettings.propTypes = {
  avatar: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
