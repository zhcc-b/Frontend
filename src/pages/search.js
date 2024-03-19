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
import { useState } from "react";


const Page = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const onResponse = (response) => {
    if (response.status) {

    } else {
      setSeverity('error');
      setMessage('An unexpected error occurred: ' + response.data.detail);
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
          <Container maxWidth="xl">
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
          <Container maxWidth={'xl'}>
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
                  <Typography variant="h6">Matching Rooms</Typography>
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
              {/*{courses.map((course) => (*/}
              {/*  <Grid*/}
              {/*    key={course.id}*/}
              {/*    xs={12}*/}
              {/*    md={4}*/}
              {/*  >*/}
              {/*    <RoomCard room={course} />*/}
              {/*  </Grid>*/}
              {/*))}*/}
            </Grid>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Page;
