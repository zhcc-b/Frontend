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
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FormControl, FormHelperText, InputLabel, Select } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import {paths} from "../../../paths";
import {useSearchParams} from 'src/hooks/use-search-params';

export const ProfileGeneral = (props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const [loading, setLoading] = useState(false);
  const { userData } = props;
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

  function handleClick() {
    setLoading(true);
    router.push(returnTo || paths.dashboard.account);
    setLoading(false);
  }

  return (
    <>
      <Box
        style={{ backgroundImage: "url('/assets/cover/minimal-1-4x3-large.png')" }}
        sx={{
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          borderRadius: 1,
          height: 348,
          position: 'relative',
          '&:hover': {
            '& button': {
              visibility: 'visible',
            },
          },
        }}
      />
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
              <Typography variant="h6">Personal Information</Typography>
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

                    </Stack>

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
                      label="Username"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dashed',
                        },
                      }}
                    />
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
                      label="Email Address"
                      InputProps={{
                        readOnly: true,
                      }}
                      required
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dashed',
                        },
                      }}
                    />
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
                      value={values.phone_no}
                      label="Phone Number"
                      InputProps={{
                        readOnly: true,
                      }}
                      type="number"
                      inputProps={{ maxLength: 10 }}
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dashed',
                        },
                      }}
                    />
                  </FormControl>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <FormControl fullWidth>
                    <TextField
                      id={'gender'}
                      name={'gender'}
                      error={profileError.gender.error}
                      value={values.gender}
                      label="Gender"
                      InputProps={{
                        readOnly: true,
                      }}
                    >
                    </TextField>
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
                      value={values.age}
                      label="Age"
                      type="number"
                      InputProps={{
                        readOnly: true,
                      }}
                      inputProps={{ maxLength: 2 }}
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dashed',
                        },
                      }}
                    />
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
                      value={values.description}
                      inputProps={{ maxLength: 300 }}
                      label="Description"
                      multiline
                      InputProps={{
                        readOnly: true,
                      }}
                      rows={3}
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dashed',
                        },
                      }}
                    />
                  </FormControl>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  justifyContent="flex-end"
                >
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
    </Stack>
    </>
  );
};

ProfileGeneral.propTypes = {
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};
