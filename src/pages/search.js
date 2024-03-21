import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import { RoomCard } from 'src/sections/rooms/room-card';
import { SearchBar } from 'src/sections/search/room-search-bar';
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useEffect, useState } from "react";
import sendHttpRequest from "../utils/send-http-request";
import Pagination from '@mui/material/Pagination';


const Page = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const [text, setText] = useState('Matching Room Recommendations')

  const [recommendedRooms, setRecommendedRooms] = useState([])
  const [searchResults, setSearchResults] = useState([])

  const [pageCount, setPageCount] = useState(0)
  const [nextPage, setNextPage] = useState('')
  const itemPerPage = 20

  useEffect(() => {
    sendHttpRequest('http://localhost:8000/events/list/', 'GET').then((response) => {
      if (response.status === 200 || response.status === 201) {
        setRecommendedRooms(response.data)
        setPageCount(Math.ceil(response.data.count / itemPerPage))
        setNextPage(response.data.next)
      } else {
        setSeverity('error');
        setMessage('An unexpected error occurred: ' + response.data);
        setOpen(true);
      }
    });
  }, []);

  const onResponse = (response) => {
    if (response.status === 200 || response.status === 201) {
      setSearchResults(response.data)
      setPageCount(Math.ceil(response.data.count / itemPerPage))
      setNextPage(response.data.next)
      setText('Search Results')
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

  const handlePageChange = (event, value) => {
    let url = new URL(nextPage);
    let params = new URLSearchParams(url.search);
    params.set('page', value);
    url.search = params.toString();
    sendHttpRequest(url.toString(), 'GET').then((response) => {
      if (response.status === 200 || response.status === 201) {
        setRecommendedRooms(response.data)
      } else {
        setSeverity('error');
        setMessage('An unexpected error occurred: ' + response.data);
        setOpen(true);
      }
    });
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
            // sx={{
            //   "&.MuiContainer-maxWidthXl": {
            //     maxWidth: "110em",
            //   },
            // }}
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
            // sx={{
            //   "&.MuiContainer-maxWidthXl": {
            //     maxWidth: "110em",
            //   },
            // }}
          >
            <Typography
              variant="h6"
              mb={3}
            >
              {text}
            </Typography>

            <Grid
              container
              spacing={4}
            >
              {searchResults.results && searchResults.results.length > 0? (
                searchResults.results.map((room) => (
                  <Grid
                    key={room.id}
                    xs={12}
                    md={4}
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
                recommendedRooms.results ? (
                  recommendedRooms.results.map((room) => (
                    <Grid
                      key={room.id}
                      xs={12}
                      md={4}
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
        <Box
          display="flex"
           justifyContent="center"
           mb={6}
        >
          <Pagination
            count={pageCount}
            size="large"
            onChange={handlePageChange}
          />
        </Box>
      </Box>
    </>
  );
};

export default Page;
