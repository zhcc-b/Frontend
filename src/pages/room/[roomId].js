import {useCallback, useEffect, useState} from 'react';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Link from '@mui/material/Link';
import SvgIcon from '@mui/material/SvgIcon';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {paths} from 'src/paths';
import {useRouter} from "next/router";
import sendHttpRequest from "src/utils/send-http-request";
import {RoomSummary} from 'src/sections/rooms/room-summary';
import {RoomOverview} from "src/sections/rooms/room-overview";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

import {Link01} from '@untitled-ui/icons-react'
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import {jwtDecode} from "jwt-decode";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import confetti from "canvas-confetti";
import {formatDateTime} from "src/utils/format-datetime";


const tabs = [
  { label: 'Overview', value: 'overview' },
  // { label: 'Reviews', value: 'reviews' },
  // { label: 'Activity', value: 'activity' },
  { label: 'Members', value: 'members' },
  // { label: 'Assets', value: 'assets' },
];

const Page = () => {
  const router = useRouter();
  const {roomId} = router.query;
  const [room, setRoom] = useState(null);
  const [currentTab, setCurrentTab] = useState('overview');
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Ensure the effect runs only when the router is ready and roomId is available
    if (router.isReady && roomId) {
      sendHttpRequest(
        `http://localhost:8000/events/${roomId}/`,
        'GET'
      ).then(response => {
        if (response.status === 200 || response.status === 201) {
          setRoom(response.data);
        } else if (response.status === 401 || response.status === 403) {
          router.push('/401');
        } else if (response.status === 404) {
          router.push('/404');
        } else {
          router.push('/500');
        }
      });
    }
  }, [roomId, router]);

  function handleJoin() {
    const token = localStorage.getItem('JWT');
    const user_id = jwtDecode(token).user_id;
    if (!token) {
      const returnTo = encodeURIComponent(window.location.href);
      window.location.href = `/auth/jwt/login?returnTo=${returnTo}`;
    } else {
      sendHttpRequest(
        'http://localhost:8000/events/join/',
        'PUT',
        {id: user_id}
      ).then(response =>{
        if (response.status === 200 || response.status === 201) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: {y: 0.6}
          });
          setSeverity('success');
          setMessage('You have successfully joined the room!');
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
  }

  function handleShare() {
    let roomIdStr = Array.isArray(roomId) ? roomId.join('') : roomId;
    navigator.clipboard.writeText(btoa(`room=${roomIdStr}`));
    setSeverity('success');
    setMessage('Link copied to clipboard!');
    setOpen(true);
  }

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

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

      <Seo title="Matching Room Details" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            spacing={4}
          >
            <Grid
              xs={12}
              lg={8.5}
            >
              <Stack spacing={4}>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={paths.index}
                  sx={{
                    alignItems: 'center',
                    display: 'inline-flex',
                  }}
                  underline="hover"
                >
                  <SvgIcon sx={{mr: 1}}>
                    <ArrowLeftIcon/>
                  </SvgIcon>
                  <Typography variant="subtitle2">Home</Typography>
                </Link>
                <Stack
                  alignItems="center"
                  direction="row"
                  justifyContent="space-between"
                  spacing={3}
                >
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={2}
                  >
                    {room ? <Avatar src={room.owner.avatar}/> : null}
                    {room ? <div>
                      <Typography variant="subtitle2">
                        By {room.owner.username}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                      >
                        {formatDateTime(room.created_at)}
                      </Typography>
                    </div> : null}
                  </Stack>
                  <Button
                    startIcon={
                      <SvgIcon>
                        <PlusIcon/>
                      </SvgIcon>
                    }
                    variant="contained"
                    onClick={handleJoin}
                  >
                    Join
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid
              xs={12}
              lg={8.4}
            >
              <Card>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 3,
                  }}
                >
                  <Tabs
                    indicatorColor="primary"
                    onChange={handleTabsChange}
                    scrollButtons="auto"
                    textColor="primary"
                    value={currentTab}
                    variant="scrollable"
                  >
                    {tabs.map((tab) => (
                      <Tab
                        key={tab.value}
                        label={tab.label}
                        value={tab.value}
                        sx={{px: 1}}
                      />
                    ))}
                  </Tabs>
                  <IconButton
                    aria-label="share"
                    onClick={handleShare}
                  >
                    <Link01/>
                  </IconButton>
                  {/*<Button*/}
                  {/*  startIcon={*/}
                  {/*    <SvgIcon>*/}
                  {/*      <Link01/>*/}
                  {/*    </SvgIcon>*/}
                  {/*  }*/}
                  {/*  variant='text'*/}
                  {/*>*/}
                  {/*  Copy Link*/}
                  {/*</Button>*/}
                </Box>
                <Divider/>
                {/*内容填充*/}
                <CardContent>
                  {room ? currentTab === 'overview' && <RoomOverview room={room}/> : null}
                  {/*{currentTab === 'reviews' && (*/}
                  {/*  <CompanyReviews*/}
                  {/*    reviews={company.reviews || []}*/}
                  {/*    averageRating={company.averageRating}*/}
                  {/*  />*/}
                  {/*)}*/}
                  {/*{currentTab === 'activity' && (*/}
                  {/*  <CompanyActivity activities={company.activities || []} />*/}
                  {/*)}*/}
                  {/*{currentTab === 'team' && <CompanyTeam members={company.members || []} />}*/}
                  {/*{currentTab === 'assets' && <CompanyAssets assets={company.assets || []} />}*/}
                </CardContent>
              </Card>
            </Grid>
            <Grid
              xs={12}
              lg={3.6}
            >
              {room ? <RoomSummary room={room} /> : null}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Page;
