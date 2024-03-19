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


const Page = () => {
  return (
    <>
      <Seo title="Search" />
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
              Find unparalleled knowledge
            </Typography>
            <Typography
              color="inherit"
              sx={{ mt: 1, mb: 6 }}
            >
              Learn from the top-tier creatives and leading experts in AI
            </Typography>
            <SearchBar />
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
                <Typography variant="h6">Welcome back, Anika</Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 1 }}
                  variant="body2"
                >
                  Nice progress so far, keep it up!
                </Typography>
              </Grid>
              <Grid
                xs={12}
                md={9}
              >
              </Grid>
              <Grid
                xs={12}
                md={3}
              >
              </Grid>
              <Grid xs={12}>
                <Stack
                  alignItems="flex-start"
                  direction="row"
                  justifyContent="space-between"
                  spacing={3}
                >
                  <Typography variant="h6">My Courses</Typography>
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
