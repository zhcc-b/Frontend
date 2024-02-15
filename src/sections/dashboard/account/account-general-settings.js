import PropTypes from 'prop-types';
// import Camera01Icon from '@untitled-ui/icons-react/build/esm/Camera01';
// import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
// import { alpha } from '@mui/system/colorManipulator';
// import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
// import SvgIcon from '@mui/material/SvgIcon';
// import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
// import { DatePicker } from '@mui/x-date-pickers';
import { useCallback, useEffect, useState } from 'react';
import useUserInput from 'src/hooks/use-user-input';
import sendHttpRequest from 'src/utils/send-http-request';
import { FormControl, FormHelperText, InputLabel, Select } from '@mui/material';
import { fileToBase64 } from 'src/utils/file-to-base64';
// import { FileDropzone } from 'src/components/file-dropzone';
import confetti from 'canvas-confetti';
import { AvatarDropzone } from 'src/components/avatar-dropzone';

export const AccountGeneralSettings = (props) => {
  const { init_avatar, userData } = props;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');
  const [avatar, setAvatar] = useState(init_avatar);
  console.log(userData);
  const [values, setValues] = useState({
    avatar_data: null,
    email: '',
    age: '',
    phone: '',
    name: '',
    sports: [],
    gender: '',
    description: '',
  });

  useEffect(() => {
    setValues({
      avatar_data: userData.avatar_data,
      email: userData.email,
      age: userData.age,
      phone: userData.phone,
      name: userData.name,
      sports: userData.sports_you_can_play ? userData.sports_you_can_play.split(', ') : [],
      gender: userData.gender,
      description: userData.description,
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
    phone: { error: false, message: '' },
    name: { error: false, message: '' },
    sports: { error: false, message: '' },
    // birthday: { error: false, message: '' },
    gender: { error: false, message: '' },
    description: { error: false, message: '' },
  });
  const isSportSelected = (sport) => values.sports.includes(sport);
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

  function validateProfile() {
    const isNameEmpty = values.name === '';
    const isEmailEmpty = values.email === '';
    const isPhoneEmpty = values.phone === '';
    const isAgeEmpty = values.age === '';
    // const isBirthdayEmpty = values.birthday === null;
    const isGenderEmpty = values.gender === null;
    const isAvatarEmpty = values.avatar_data === '';

    // const isInvaildPhone = !/^\d{10}$/.test(values.phone);
    const isInvaildAge =
      !/^\d+$/.test(values.age) || parseInt(values.age) < 0 || parseInt(values.age) > 200;
    const isUnknownGender = !['Prefer not to say', 'Male', 'Female', 'Other'].includes(
      values.gender
    );
    const isUnknownSport = !values.sports.every((sport) => sportsOptions.includes(sport));
    const isDescriptionTooLong = values.description.length > 300;
    // const isNotBirthdayObject = !values.birthday instanceof Date;
    // const isInvaildBirthday = values.birthday > today;
    if (values.avatar_data !== null && values.avatar_data.startsWith('http')) {
      delete values.avatar_data;
    }

    setProfileError({
      ...profileError,
      avatar_data: {
        error: isAvatarEmpty,
        message: isAvatarEmpty ? 'Avatar image is required' : '',
      },
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
      // phone: {
      //   error: isPhoneEmpty || isInvaildPhone,
      //   message: isPhoneEmpty
      //     ? 'Phone number is required'
      //     : isInvaildPhone
      //     ? 'Invaild phone number'
      //     : '',
      // },
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
      // !isInvaildPhone &&
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
      const sportString = copyData.sports.join(', ');
      delete copyData.sports;
      copyData.sports_you_can_play = sportString;
      sendHttpRequest('http://localhost:8000/userprofile/editprofile/', 'PATCH', copyData).then(
        (response) => {
          if (response.status === 200 || response.status === 201) {
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
    if (values.sports.includes(sport)) {
      values.sports.splice(values.sports.indexOf(sport), 1);
    } else {
      values.sports.push(sport);
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
                      id={'name'}
                      name={'name'}
                      value={values.name}
                      onChange={handleChange}
                      label="Name"
                      error={profileError.name.error}
                      required
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dashed',
                        },
                      }}
                    />
                    {profileError.name.error && (
                      <FormHelperText error>{profileError.name.message}</FormHelperText>
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
                      id={'phone'}
                      name={'phone'}
                      error={profileError.phone.error}
                      value={values.phone}
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
                    {profileError.phone.error && (
                      <FormHelperText error>{profileError.phone.message}</FormHelperText>
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
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
