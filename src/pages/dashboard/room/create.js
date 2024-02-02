import {useCallback, useState} from 'react';
// import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
// import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {FormControl, FormHelperText, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {Autocomplete} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import {LoadingButton} from "@mui/lab";

import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {FileDropzone} from 'src/components/file-dropzone';
import {QuillEditor} from 'src/components/quill-editor';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
// import { usePageView } from 'src/hooks/use-page-view';
import useUserInput from "src/hooks/use-user-input";
import {Layout as DashboardLayout} from 'src/layouts/dashboard';
import {paths} from 'src/paths';
import {fileToBase64} from 'src/utils/file-to-base64';
import sendHttpRequest from "src/utils/send-http-request";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

// const initialCover = '/assets/covers/abstract-1-4x3-large.png';

const Page = () => {
  // const [cover, setCover] = useState(initialCover);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');
  const [cover, setCover] = useState(null);
  const today = new Date().setHours(0, 0, 0, 0);
  const [formData, handleInputChange, handleDateChange, handleEditorChange, handleAutocompleteChange] = useUserInput({
    title: '',
    shortDescription: '',
    location: '',
    startTime: null,
    endTime: null,
    sportType: '',
    playerLimit: '',
    preferredGender: 'None',
    visibilityControl: 'Public',
    content: '',
    cover: ''
  });

  const [formError, setFormError] = useState({
    title: {error: false, message: ''},
    shortDescription: {error: false, message: ''},
    location: {error: false, message: ''},
    startTime: {error: false, message: ''},
    endTime: {error: false, message: ''},
    sportType: {error: false, message: ''},
    playerLimit: {error: false, message: ''},
    preferredGender: {error: false, message: ''},
    visibilityControl: {error: false, message: ''},
    content: {error: false, message: ''},
    cover: {error: false, message: ''}
  });

  const sport_type = [
    {label: 'badminton'},
    {label: 'basketball'},
    {label: 'football'},
    {label: 'tennis'},
    {label: 'volleyball'},
  ];

  // usePageView();

  function validateForm() {
    const isTitleEmpty = formData.title === '';
    const isShortDescriptionEmpty = formData.shortDescription === '';
    const isLocationEmpty = formData.location === '';
    const isStartTimeEmpty = formData.startTime === null;
    const isEndTimeEmpty = formData.endTime === null;
    const isSportTypeEmpty = formData.sportType === '';
    const isPlayerLimitEmpty = formData.playerLimit === '';
    const isPreferredGenderEmpty = formData.preferredGender === '';
    const isVisibilityControlEmpty = formData.visibilityControl === '';
    const isContentEmpty = formData.content === '';
    const isCoverEmpty = formData.cover === '';

    const isUnknownSportType = !sport_type.some((type) => type.label === formData.sportType);

    const isPlayerLimitNotPositiveInt = isNaN(parseInt(formData.playerLimit)) || parseInt(formData.playerLimit) < 0;

    const isUnknownPreferredGender = !['None', 'Male', 'Female', 'Other'].includes(formData.preferredGender);
    const isUnknownVisibilityControl = !['Public', 'Private'].includes(formData.visibilityControl);

    console.log(isSportTypeEmpty)
    console.log(isUnknownSportType)

    const isNotStartTimeObject = !formData.startTime instanceof Date;
    const isUnknownEndTimeObject = !formData.endTime instanceof Date;
    const isStartTimeAfterEndTime = formData.startTime > formData.endTime;

    setFormError({
      ...formError,
      title: {
        error: isTitleEmpty,
        message: isTitleEmpty ? 'Title is required' : ''
      },
      shortDescription: {
        error: isShortDescriptionEmpty,
        message: isShortDescriptionEmpty ? 'Short description is required' : ''
      },
      location: {
        error: isLocationEmpty,
        message: isLocationEmpty ? 'Location is required' : ''
      },
      startTime: {
        error: isStartTimeEmpty || isNotStartTimeObject || isStartTimeAfterEndTime,
        message: isStartTimeEmpty ? 'Start time is required' : isNotStartTimeObject ? 'Invalid start time input' : isStartTimeAfterEndTime ? 'Start time must be before end time' : ''
      },
      endTime: {
        error: isEndTimeEmpty || isUnknownEndTimeObject || isStartTimeAfterEndTime,
        message: isEndTimeEmpty ? 'End time is required' : isUnknownEndTimeObject ? 'Invalid end time input' : isStartTimeAfterEndTime ? 'End time must be after start time' : ''
      },
      sportType: {
        error: isSportTypeEmpty || isUnknownSportType,
        message: isSportTypeEmpty ? 'Sport type is required' : isUnknownSportType ? 'Invalid sport type' : ''
      },
      playerLimit: {
        error: isPlayerLimitEmpty || isPlayerLimitNotPositiveInt,
        message: isPlayerLimitEmpty ? 'Player limit is required' : isPlayerLimitNotPositiveInt ? 'Positive integers only' : ''
      },
      preferredGender: {
        error: isPreferredGenderEmpty || isUnknownPreferredGender,
        message: isPreferredGenderEmpty ? 'Preferred gender is required' : isUnknownPreferredGender ? 'Invalid preferred gender' : null
      },
      visibilityControl: {
        error: isVisibilityControlEmpty || isUnknownVisibilityControl,
        message: isVisibilityControlEmpty ? 'Visibility control is required' : isUnknownVisibilityControl ? 'Invalid visibility control option' : null
      },
      content: {
        error: isContentEmpty,
        message: isContentEmpty ? 'Content is required' : ''
      },
      cover: {
        error: isCoverEmpty,
        message: isCoverEmpty ? 'Cover image is required' : ''
      }
    });

    return !isTitleEmpty && !isShortDescriptionEmpty && !isLocationEmpty && !isStartTimeEmpty && !isEndTimeEmpty && !isSportTypeEmpty && !isPlayerLimitEmpty && !isPreferredGenderEmpty && !isVisibilityControlEmpty && !isContentEmpty && !isCoverEmpty;
  }

  function handleClick() {
    setLoading(true);
    if (validateForm()) {
      sendHttpRequest(
        'http://localhost:3000/api/room',
        'POST',
        formData
      ).then(response => {
        if (response.status === 200) {
          setSeverity('success');
          setMessage('Matching room created successfully');
          setOpen(true);
        }
        else if (response.status === 400) {
          setSeverity('warning');
          setMessage('Please fill in all the required fields');
          setOpen(true);
        }
        else {
          setSeverity('error');
          setMessage('An unexpected error occurred: ' + response.data);
          setOpen(true);
        }
      });
    }
    setLoading(false);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleCoverDrop = useCallback(async ([file]) => {
    const data = await fileToBase64(file);
    setCover(data);
    formData.cover = data; // directly assign the data to formData.cover
  }, [formData]);

  const handleCoverRemove = useCallback(() => {
    setCover(null);
    formData.cover = null;
  }, [formData]);

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>

      <Seo title="Matching Room: Create"/>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={1}>
            <Typography variant="h3">Create a new matching room</Typography>
            <Breadcrumbs separator={<BreadcrumbsSeparator/>}>
              <Link
                color="text.primary"
                component={RouterLink}
                href={paths.dashboard.index}
                variant="subtitle2"
              >
                Dashboard
              </Link>
              <Link
                color="text.primary"
                component={RouterLink}
                href={paths.dashboard.room.index}
                variant="subtitle2"
              >
                Room
              </Link>
              <Typography
                color="text.secondary"
                variant="subtitle2"
              >
                Create
              </Typography>
            </Breadcrumbs>
          </Stack>
          <Card
            elevation={16}
            sx={{
              alignItems: 'center',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
              mb: 8,
              mt: 6,
              px: 3,
              py: 2,
            }}
          >
            <Typography variant="subtitle1">Hello, User</Typography>
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
            >
              <Button
                color="inherit"
                component={RouterLink}
                href={paths.dashboard.room.index}
              >
                Cancel
              </Button>
              <LoadingButton
                loading={loading}
                loadingPosition="end"
                endIcon={<SendIcon />}
                variant="contained"
                onClick={handleClick}
              >
                Publish changes
              </LoadingButton>
              {/*<Button*/}
              {/*  // component={RouterLink}*/}
              {/*  // href={paths.dashboard.room.roomDetails}*/}
              {/*  variant="contained"*/}
              {/*  onClick={handleClick}*/}
              {/*>*/}
              {/*  Publish changes*/}
              {/*</Button>*/}
              {/*<IconButton>*/}
              {/*  <SvgIcon>*/}
              {/*    <DotsHorizontalIcon />*/}
              {/*  </SvgIcon>*/}
              {/*</IconButton>*/}
            </Stack>
          </Card>
          <Stack spacing={3}>
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
                    <Typography variant="h6">Title</Typography>
                  </Grid>
                  <Grid
                    xs={12}
                    md={8}
                  >
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        id={'room-title'}
                        label="Title"
                        name={'title'}
                        value={formData.title}
                        error={formError.title.error}
                        helperText={formError.title.message}
                        onChange={handleInputChange}
                        variant={'outlined'}
                        required
                      />
                      <TextField
                        fullWidth
                        id={'room-short-description'}
                        label="Short description"
                        name={'shortDescription'}
                        value={formData.shortDescription}
                        error={formError.shortDescription.error}
                        helperText={formError.shortDescription.message}
                        onChange={handleInputChange}
                        variant={'outlined'}
                      />
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
                    <Typography variant="h6">Location and dates</Typography>
                  </Grid>
                  <Grid
                    xs={12}
                    md={8}
                  >
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        id={'room-location'}
                        label="Location"
                        name={'location'}
                        value={formData.location}
                        error={formError.location.error}
                        helperText={formError.location.message}
                        onChange={handleInputChange}
                        variant={'outlined'}
                        required
                      />
                      <Grid container>
                        <Grid lg={6}
                              md={6}
                              sm={6}
                              xl={6}
                              xs={6}
                              sx={{pr: 1}}
                        >
                          <DateTimePicker
                            id={'room-start-time'}
                            label="Start Time"
                            name={'startTime'}
                            value={formData.startTime}
                            onChange={(newValue) => {
                              handleDateChange('startTime', newValue);
                            }}
                            minDateTime={today}
                            slotProps={{
                              textField: {
                                error: formError.startTime.error,
                                helperText: formError.startTime.message,
                                fullWidth: true,
                                variant: "outlined",
                                required: true
                              }
                            }}
                          />
                        </Grid>
                        <Grid lg={6}
                              md={6}
                              sm={6}
                              xl={6}
                              xs={6}
                              sx={{pl: 1}}
                        >
                          <DateTimePicker
                            id={'room-end-time'}
                            label="End Time"
                            name={'endTime'}
                            value={formData.endTime}
                            onChange={(newValue) => {
                              handleDateChange('endTime', newValue);
                            }}
                            minDateTime={formData.startTime ? new Date(Math.max(today, formData.startTime.getTime())) : today}
                            slotProps={{
                              textField: {
                                error: formError.endTime.error,
                                helperText: formError.endTime.message,
                                fullWidth: true,
                                variant: "outlined",
                                required: true
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
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
                    <Typography variant="h6">Preference setting</Typography>
                  </Grid>
                  <Grid
                    xs={12}
                    md={8}
                  >
                    <Stack spacing={3}>
                      <Grid container>
                        <Grid lg={6}
                              md={6}
                              sm={6}
                              xl={6}
                              xs={6}
                              sx={{pr: 1}}
                        >
                          <Autocomplete
                            id="sport-type-select"
                            name={'sportType'}
                            onChange={(event, value) => {
                              handleAutocompleteChange('sportType', value);
                            }}
                            options={sport_type.map((option) => option.label)}
                            renderInput={(params) =>
                              <TextField
                                {...params}
                                id={'sport-type-select-option'}
                                label="Sport Type"
                                error={formError.sportType.error}
                                helperText={formError.sportType.message}
                                variant={'outlined'}
                                required
                              />
                            }
                          />
                        </Grid>
                        <Grid lg={6}
                              md={6}
                              sm={6}
                              xl={6}
                              xs={6}
                              sx={{pl: 1}}
                        >
                          <TextField
                            id={'player-limit'}
                            label="Player Limit"
                            type="number"
                            name={'playerLimit'}
                            value={formData.playerLimit}
                            error={formError.playerLimit.error}
                            helperText={formError.playerLimit.message}
                            onChange={handleInputChange}
                            variant={'outlined'}
                            required
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid lg={6}
                              md={6}
                              sm={6}
                              xl={6}
                              xs={6}
                              sx={{pr: 1}}
                        >
                          <FormControl fullWidth>
                            <InputLabel id="preferred-gender-select-label">Preferred
                              Gender</InputLabel>
                            <Select
                              labelId="preferred-gender-select-label"
                              id="preferred-gender-select"
                              label=" Preferred Gender "
                              name={'preferredGender'}
                              value={formData.preferredGender}
                              error={formError.preferredGender.error}
                              onChange={handleInputChange}
                            >
                              <MenuItem value={'None'}>None</MenuItem>
                              <MenuItem value={'Male'}>Male</MenuItem>
                              <MenuItem value={'Female'}>Female</MenuItem>
                              <MenuItem value={'Other'}>Other</MenuItem>
                            </Select>
                            {formError.preferredGender.error && (
                              <FormHelperText error>
                                {formError.preferredGender.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid lg={6}
                              md={6}
                              sm={6}
                              xl={6}
                              xs={6}
                              sx={{pl: 1}}
                        >
                          <FormControl fullWidth>
                            <InputLabel id="visibility-control-select-label">Visibility
                              Control</InputLabel>
                            <Select
                              labelId="visibility-control-select-label"
                              id="visibility-control-select"
                              label=" Visibility Control "
                              name={'visibilityControl'}
                              value={formData.visibilityControl}
                              error={formError.visibilityControl.error}
                              onChange={handleInputChange}
                            >
                              <MenuItem value={'Public'}>Public</MenuItem>
                              <MenuItem value={'Private'}>Private</MenuItem>
                            </Select>
                            {formError.visibilityControl.error && (
                              <FormHelperText error>
                                {formError.visibilityControl.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                      </Grid>
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
                    <Typography variant="h6">Post cover</Typography>
                  </Grid>
                  <Grid
                    xs={12}
                    md={8}
                  >
                    <Stack spacing={3}>
                      {cover ? (
                        <Box
                          sx={{
                            backgroundImage: `url(${cover})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            borderRadius: 1,
                            height: 230,
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
                            borderRadius: 1,
                            borderStyle: 'dashed',
                            borderColor: 'grey.500',
                            height: 230,
                            mt: 3,
                            p: 3,
                          }}
                        >
                          <Typography
                            align="center"
                            color="text.secondary"
                            variant="h6"
                          >
                            Select a cover image
                          </Typography>
                          <Typography
                            align="center"
                            color="text.secondary"
                            sx={{mt: 1}}
                            variant="subtitle1"
                          >
                            Image used for the matching room cover
                          </Typography>
                        </Box>
                      )}
                      <div>
                        <Button
                          color="inherit"
                          disabled={!cover}
                          onClick={handleCoverRemove}
                        >
                          Remove photo
                        </Button>
                      </div>
                      <FileDropzone
                        accept={{'image/*': []}}
                        maxFiles={1}
                        onDrop={handleCoverDrop}
                        caption="(SVG, JPG, PNG, or gif maximum 900x400)"
                      />
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
                    <Typography variant="h6">Content</Typography>
                  </Grid>
                  <Grid
                    xs={12}
                    md={8}
                  >
                    <QuillEditor
                      placeholder="Write something"
                      sx={{height: 330}}
                      name={'content'}
                      value={formData.content}
                      onChange={handleEditorChange}
                    />
                    {formError.content.error && (
                      <FormHelperText
                        error
                        sx={{ pl: 2 }}
                      >
                        {formError.content.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
          <Box
            sx={{
              display: {
                sm: 'none',
              },
              mt: 2,
            }}
          >
            <Button
              // component={RouterLink}
              // href={paths.dashboard.room.roomDetails}
              variant="contained"
              onClick={handleClick}
            >
              Publish changes
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
