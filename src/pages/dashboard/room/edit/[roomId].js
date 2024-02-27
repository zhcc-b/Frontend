import {useCallback, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {Autocomplete, FormControl, FormHelperText, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import SendIcon from '@mui/icons-material/Send';
import {LoadingButton} from "@mui/lab";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {FileDropzone} from 'src/components/file-dropzone';
import {QuillEditor} from 'src/components/quill-editor';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import useUserInput from "src/hooks/use-user-input";
import {Layout as DashboardLayout} from 'src/layouts/dashboard';
import {paths} from 'src/paths';
import {fileToBase64} from 'src/utils/file-to-base64';
import sendHttpRequest from "src/utils/send-http-request";
import confetti from "canvas-confetti";
import {useRouter} from 'next/router'

let initialRoomInfo = {
  id: '',
  title: '',
  description: '',
  location: '',
  start_time: null,
  end_time: null,
  level: '',
  age_group: '',
  sport_data: '',
  max_players: '',
  visibility: '',
  content: '',
  attachment_data: ''
};

const sport_type = ['Badminton', 'Basketball', 'Football', 'Tennis', 'Volleyball'];

const Page = () => {
  const router = useRouter();
  const {roomId} = router.query;

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const today = new Date().setHours(0, 0, 0, 0);
  const [formData, setFormData, handleInputChange, handleDateChange, handleEditorChange, handleAutocompleteChange] = useUserInput(initialRoomInfo);

  useEffect(() => {
    if (router.isReady === false) {
      return;
    }

    sendHttpRequest(
      `http://localhost:8000/events/${roomId}/`,
      'GET'
    ).then(response => {

      if (response.status === 200 || response.status === 201) {
        const originalData = {
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          location: response.data.location,
          start_time: new Date(response.data.start_time),
          end_time: new Date(response.data.end_time),
          level: response.data.level,
          age_group: response.data.age_group,
          sport_data: response.data.sport.name.charAt(0).toUpperCase() + response.data.sport.name.slice(1),
          max_players: response.data.max_players,
          content: response.data.content,
          attachment_data: response.data.attachment,
          visibility: response.data.visibility
        }
        setAttachment(response.data.attachment);
        setFormData(originalData);
      } else if (response.status === 401 || response.status === 403) {
        router.push('/401');
      } else if (response.status === 404) {
        router.push('/404');
      }else {
        router.push('/500');
      }
    })
  }, [roomId, setFormData, router]);

  const [formError, setFormError] = useState({
    title: {error: false, message: ''},
    description: {error: false, message: ''},
    location: {error: false, message: ''},
    start_time: {error: false, message: ''},
    end_time: {error: false, message: ''},
    level: {error: false, message: ''},
    age_group: {error: false, message: ''},
    sport_data: {error: false, message: ''},
    max_players: {error: false, message: ''},
    visibility: {error: false, message: ''},
    content: {error: false, message: ''},
    attachment_data: {error: false, message: ''}
  });

  function validateForm() {
    const isTitleEmpty = formData.title === '';
    const isDescriptionEmpty = formData.description === '';
    const isLocationEmpty = formData.location === '';
    const isStartTimeEmpty = formData.start_time === null;
    const isEndTimeEmpty = formData.end_time === null;
    const isSportEmpty = formData.sport_data === '';
    const isMaxPlayerEmpty = formData.max_players === '';
    const isVisibilityEmpty = formData.visibility === '';
    const isContentEmpty = formData.content === '';
    const isCoverEmpty = formData.attachment_data === '';
    const isLevelEmpty = formData.level === '';
    const isAgeGroupEmpty = formData.age_group === '';

    const isUnknownLevel = !['B', 'I', 'A', 'P'].includes(formData.level);
    const isUnknownAgeGroup = !['C', 'T', 'A', 'S'].includes(formData.age_group);

    const isUnknownSport = !sport_type.includes(formData.sport_data);

    const isMaxPlayerNotPositiveInt = !/^\d+$/.test(formData.max_players) || parseInt(formData.max_players) < 0;

    const isUnknownVisibility = !['Public', 'Private'].includes(formData.visibility);

    const isNotStartTimeObject = !formData.start_time instanceof Date;
    const isUnknownEndTimeObject = !formData.end_time instanceof Date;
    const isStartTimeAfterEndTime = formData.start_time > formData.end_time;

    if (formData && formData.attachment_data && typeof formData.attachment_data === 'string' && formData.attachment_data.startsWith('http')) {
      delete formData.attachment_data;
    }

    setFormError({
      ...formError,
      title: {
        error: isTitleEmpty,
        message: isTitleEmpty ? 'Title is required' : ''
      },
      description: {
        error: isDescriptionEmpty,
        message: isDescriptionEmpty ? 'Short description is required' : ''
      },
      location: {
        error: isLocationEmpty,
        message: isLocationEmpty ? 'Location is required' : ''
      },
      start_time: {
        error: isStartTimeEmpty || isNotStartTimeObject || isStartTimeAfterEndTime,
        message: isStartTimeEmpty ? 'Start time is required' : isNotStartTimeObject ? 'Invalid start time input' : isStartTimeAfterEndTime ? 'Start time must be before end time' : ''
      },
      end_time: {
        error: isEndTimeEmpty || isUnknownEndTimeObject || isStartTimeAfterEndTime,
        message: isEndTimeEmpty ? 'End time is required' : isUnknownEndTimeObject ? 'Invalid end time input' : isStartTimeAfterEndTime ? 'End time must be after start time' : ''
      },
      sport_data: {
        error: isSportEmpty || isUnknownSport,
        message: isSportEmpty ? 'Sport type is required' : isUnknownSport ? 'Invalid sport type' : ''
      },
      max_players: {
        error: isMaxPlayerEmpty || isMaxPlayerNotPositiveInt,
        message: isMaxPlayerEmpty ? 'Max Players is required' : isMaxPlayerNotPositiveInt ? 'Positive integers only' : ''
      },
      visibility: {
        error: isVisibilityEmpty || isUnknownVisibility,
        message: isVisibilityEmpty ? 'Visibility control is required' : isUnknownVisibility ? 'Invalid visibility control option' : null
      },
      content: {
        error: isContentEmpty,
        message: isContentEmpty ? 'Content is required' : ''
      },
      attachment_data: {
        error: isCoverEmpty,
        message: isCoverEmpty ? 'Cover image is required' : ''
      },
      level: {
        error: isLevelEmpty || isUnknownLevel,
        message: isLevelEmpty ? 'Level is required' : isUnknownLevel ? 'Invalid level' : ''
      },
      age_group: {
        error: isAgeGroupEmpty || isUnknownAgeGroup,
        message: isAgeGroupEmpty ? 'Age group is required' : isUnknownAgeGroup ? 'Invalid age group' : ''
      }
    });

    return !isTitleEmpty && !isDescriptionEmpty && !isLocationEmpty && !isStartTimeEmpty && !isEndTimeEmpty && !isSportEmpty && !isMaxPlayerEmpty && !isContentEmpty && !isUnknownLevel && !isUnknownAgeGroup && !isUnknownSport && !isMaxPlayerNotPositiveInt && !isNotStartTimeObject && !isUnknownEndTimeObject && !isStartTimeAfterEndTime && !isAgeGroupEmpty && !isLevelEmpty && !isUnknownVisibility && !isVisibilityEmpty;
  }

  function handleClick() {
    setLoading(true);
    if (validateForm()) {
      sendHttpRequest(
        'http://localhost:8000/events/update/',
        'PATCH',
        formData
      ).then(response => {
        if (response.status === 200 || response.status === 201) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: {y: 0.6}
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
          setMessage('An unexpected error occurred: ' + response.data.detail);
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
    setAttachment(data);
    formData.attachment_data = data; // directly assign the data to formData.attachment
  }, [formData]);

  const handleCoverRemove = useCallback(() => {
    setAttachment(null);
    formData.attachment_data = null;
  }, [formData]);

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{width: '100%'}}
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
            <Typography variant="h3">Edit matching room</Typography>
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
                Edit
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
                endIcon={<SendIcon/>}
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
                        name={'description'}
                        value={formData.description}
                        error={formError.description.error}
                        helperText={formError.description.message}
                        onChange={handleInputChange}
                        variant={'outlined'}
                        required
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
                            name={'start_time'}
                            value={formData.start_time}
                            onChange={(newValue) => {
                              handleDateChange('start_time', newValue);
                            }}
                            minDateTime={today}
                            slotProps={{
                              textField: {
                                error: formError.start_time.error,
                                helperText: formError.start_time.message,
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
                            name={'end_time'}
                            value={formData.end_time}
                            onChange={(newValue) => {
                              handleDateChange('end_time', newValue);
                            }}
                            minDateTime={formData.start_time ? new Date(Math.max(today, formData.start_time.getTime())) : today}
                            slotProps={{
                              textField: {
                                error: formError.end_time.error,
                                helperText: formError.end_time.message,
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
                    <Typography variant="h6">Activity setting</Typography>
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
                            name={'sport_data'}
                            value={formData.sport_data}
                            isOptionEqualToValue={(option, value) => option === value || value === ""}
                            onChange={(event, value) => {
                              handleAutocompleteChange('sport_data', value);
                            }}
                            options={sport_type}
                            renderInput={(params) =>
                              <TextField
                                {...params}
                                id={'sport-type-select-option'}
                                label="Sport"
                                error={formError.sport_data.error}
                                helperText={formError.sport_data.message}
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
                          <FormControl
                            fullWidth
                            required
                          >
                            <InputLabel id="levels-select-label">Skill Level</InputLabel>
                            <Select
                              labelId="levels-select-label"
                              id="levels-select"
                              label=" Skill Level "
                              name={'level'}
                              value={formData.level}
                              error={formError.level.error}
                              onChange={handleInputChange}
                            >
                              <MenuItem value={'B'}>Beginner</MenuItem>
                              <MenuItem value={'I'}>Intermediate</MenuItem>
                              <MenuItem value={'A'}>Advanced</MenuItem>
                              <MenuItem value={'P'}>Professional</MenuItem>
                            </Select>
                            {formError.level.error && (
                              <FormHelperText error>
                                {formError.level.message}
                              </FormHelperText>
                            )}
                          </FormControl>
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
                          <TextField
                            id={'player-limit'}
                            label="Max Players"
                            // type="number"
                            name={'max_players'}
                            value={formData.max_players}
                            error={formError.max_players.error}
                            helperText={formError.max_players.message}
                            onChange={handleInputChange}
                            variant={'outlined'}
                            required
                            fullWidth
                          />
                        </Grid>
                        <Grid lg={6}
                              md={6}
                              sm={6}
                              xl={6}
                              xs={6}
                              sx={{pl: 1}}
                        >
                          <FormControl
                            fullWidth
                            required
                          >
                            <InputLabel id="age-group-select-label">Age Group</InputLabel>
                            <Select
                              labelId="age-group-select-label"
                              id="age-group-select"
                              label=" Age Group "
                              name={'age_group'}
                              value={formData.age_group}
                              error={formError.age_group.error}
                              onChange={handleInputChange}
                            >
                              <MenuItem value={'C'}>Children</MenuItem>
                              <MenuItem value={'T'}>Teenagers</MenuItem>
                              <MenuItem value={'A'}>Adults</MenuItem>
                              <MenuItem value={'S'}>Seniors</MenuItem>
                            </Select>
                            {formError.age_group.error && (
                              <FormHelperText error>
                                {formError.age_group.message}
                              </FormHelperText>
                            )}
                          </FormControl>
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
                            <InputLabel id="visibility-control-select-label">Visibility
                              Control</InputLabel>
                            <Select
                              labelId="visibility-control-select-label"
                              id="visibility-control-select"
                              label=" Visibility Control "
                              name={'visibility'}
                              value={formData.visibility}
                              error={formError.visibility.error}
                              onChange={handleInputChange}
                            >
                              <MenuItem value={'Public'}>Public</MenuItem>
                              <MenuItem value={'Private'}>Private</MenuItem>
                            </Select>
                            {formError.visibility.error && (
                              <FormHelperText error>
                                {formError.visibility.message}
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
                      {attachment ? (
                        <Box
                          sx={{
                            backgroundImage: `url(${attachment})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'attachment',
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
                          disabled={!attachment}
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
                        sx={{pl: 2}}
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
