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

import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {FileDropzone} from 'src/components/file-dropzone';
import {QuillEditor} from 'src/components/quill-editor';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
// import { usePageView } from 'src/hooks/use-page-view';
import {Layout as DashboardLayout} from 'src/layouts/dashboard';
import {paths} from 'src/paths';
import {fileToBase64} from 'src/utils/file-to-base64';

import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {FormControl, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {Autocomplete} from "@mui/lab";
import useUserInput from "src/hooks/use-user-input";

const initialCover = '/assets/covers/abstract-1-4x3-large.png';

const Page = () => {
  const [cover, setCover] = useState(initialCover);
  const [formData, handleInputChange, handleDateChange] = useUserInput({title: '', shortDescription: '', location: '', startTime: null, endTime: null, sportType: '', playerLimit: '', preferredGender: 'None', visibilityControl: 'Public'});

  const sport_type = [
    {label: 'badminton'},
    {label: 'basketball'},
    {label: 'football'},
    {label: 'tennis'},
    {label: 'volleyball'},
  ];

  // usePageView();

  const handleCoverDrop = useCallback(async ([file]) => {
    const data = await fileToBase64(file);
    setCover(data);
  }, []);

  const handleCoverRemove = useCallback(() => {
    setCover(null);
  }, []);

  return (
    <>
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
              <Button
                component={RouterLink}
                href={paths.dashboard.room.roomDetails}
                variant="contained"
              >
                Publish changes
              </Button>
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
                            slotProps={{
                              textField: {
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
                            slotProps={{
                              textField: {
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
                            options={sport_type}
                            renderInput={(params) =>
                              <TextField
                                id={'sport-type-select-option'}
                                label="Sport Type"
                                name={'sportType'}
                                value={formData.sportType}
                                onChange={handleInputChange}
                                variant={'outlined'}
                                required
                                {...params}
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
                              onChange={handleInputChange}
                            >
                              <MenuItem value={'None'}>None</MenuItem>
                              <MenuItem value={'Male'}>Male</MenuItem>
                              <MenuItem value={'Female'}>Female</MenuItem>
                              <MenuItem value={'Other'}>Other</MenuItem>
                            </Select>
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
                              onChange={handleInputChange}
                            >
                              <MenuItem value={'Public'}>Public</MenuItem>
                              <MenuItem value={'Private'}>Private</MenuItem>
                            </Select>
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
                            borderColor: 'divider',
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
                            Image used for the blog post cover and also for Open Graph meta
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
                    />
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
              component={RouterLink}
              href={paths.dashboard.room.roomDetails}
              variant="contained"
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
