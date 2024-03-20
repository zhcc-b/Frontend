import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import { RoomCard } from 'src/sections/rooms/room-card';
import { SearchBar } from 'src/sections/search/room-search-bar';
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useEffect, useState } from "react";
import sendHttpRequest from "../utils/send-http-request";


const Page = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const [recommandedRooms, setRecommandedRooms] = useState([])
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    sendHttpRequest('http://localhost:8000/events/list/', 'GET').then((response) => {
      if (response.status === 200 || response.status === 201) {
        setRecommandedRooms(response.data)
        console.log(response.data)
      } else {
        setSeverity('error');
        setMessage('An unexpected error occurred: ' + response.data);
        setOpen(true);
      }
    });
  }, []);

  const onResponse = (response) => {
    if (response.status === 200 || response.status === 201) {

      console.log('response', response.data)

    } else {
      setSeverity('error');
      setMessage('An unexpected error occurred: ' + response.data);
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Seo title="Search" />

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

      <Box
        component="main"
        sx={{ flexGrow: 1 }}
      >
        <Box
          sx={{
            backgroundColor: 'primary.darkest',
            color: 'primary.contrastText',
            py: '60px',
          }}
        >
          <Container
            maxWidth={'xl'}
            sx={{
              "&.MuiContainer-maxWidthXl": {
                maxWidth: "110em",
              },
            }}
          >
            <Typography
              color="inherit"
              variant="h5"
            >
              Find Your Perfect Sport Partners
            </Typography>
            <Typography
              color="inherit"
              sx={{ mt: 1, mb: 6 }}
            >
              Connect with people of all skill levels and age groups to enhance your sporting experience
            </Typography>
            <SearchBar onResponse={onResponse} />
          </Container>
        </Box>
        <Box sx={{ py: '64px' }}>
          <Container
            maxWidth={'xl'}
            sx={{
              "&.MuiContainer-maxWidthXl": {
                maxWidth: "110em",
              },
            }}
          >
            <Grid
              container
              spacing={{
                xs: 3,
                lg: 4,
              }}
            >
              <Grid xs={12}>
                <Stack
                  alignItems="flex-start"
                  direction="row"
                  justifyContent="space-between"
                  spacing={3}
                >
                  <Typography variant="h6">Matching Room Recommendations</Typography>
                  <Button
                    color="inherit"
                    endIcon={
                      <SvgIcon>
                        <ArrowRightIcon />
                      </SvgIcon>
                    }
                  >
                    See all
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={4}
            >
              {searchResults.length > 0 && searchResults.results.length > 0? (
                searchResults.results.map((room) => (
                  <Grid
                    key={room.id}
                    xs={12}
                    md={3}
                  >
                    <RoomCard
                      roomId={room.id ? room.id.toString() : ''}
                      authorAvatar={room.owner.avatar ? room.owner.avatar.toString() : ''}
                      authorName={room.owner.username ? room.owner.username.toString() : ''}
                      category={room.sport.name ? room.sport.name.toString() : ''}
                      cover={room.attachment ? room.attachment.toString() : ''}
                      publishedAt={room.created_at ? room.created_at.toString() : ''}
                      shortDescription={room.description ? room.description.toString() : ''}
                      title={room.title ? room.title.toString() : ''}
                      currentPlayer={room.players.length ? room.players.length.toString() : '0'}
                      maxPlayer={room.max_players ? room.max_players.toString() : ''}
                      startTime={room.start_time ? room.start_time.toString() : ''}
                      endTime={room.end_time ? room.end_time.toString() : ''}
                    />
                  </Grid>
                ))
              ) : (
                recommandedRooms.results ? (
                  recommandedRooms.results.map((room) => (
                    <Grid
                      key={room.id}
                      xs={12}
                      md={3}
                    >
                      <RoomCard
                        roomId={room.id ? room.id.toString() : ''}
                        authorAvatar={room.owner.avatar ? room.owner.avatar.toString() : ''}
                        authorName={room.owner.username ? room.owner.username.toString() : ''}
                        category={room.sport.name ? room.sport.name.toString() : ''}
                        cover={room.attachment ? room.attachment.toString() : ''}
                        publishedAt={room.created_at ? room.created_at.toString() : ''}
                        shortDescription={room.description ? room.description.toString() : ''}
                        title={room.title ? room.title.toString() : ''}
                        currentPlayer={room.players.length ? room.players.length.toString() : '0'}
                        maxPlayer={room.max_players ? room.max_players.toString() : ''}
                        startTime={room.start_time ? room.start_time.toString() : ''}
                        endTime={room.end_time ? room.end_time.toString() : ''}
                      />
                    </Grid>
                  ))
                ) : null
              )}
            </Grid>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Page;
