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
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { paths } from 'src/paths';
import {useRouter} from "next/router";
import sendHttpRequest from "../../utils/send-http-request";
import { RoomSummary } from 'src/sections/rooms/room-summary';
import { RoomOverview } from "../../sections/rooms/room-overview";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

import { Share03 } from '@untitled-ui/icons-react'
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';

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


  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  return (
    <>
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                  <SvgIcon sx={{ mr: 1 }}>
                    <ArrowLeftIcon />
                  </SvgIcon>
                  <Typography variant="subtitle2">Home</Typography>
                </Link>
                <Button
                  startIcon={
                    <SvgIcon>
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  size="small"
                >
                  Join
                </Button>
              </div>
            </Grid>
            <Grid
              xs={12}
              lg={8.5}
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
                  <IconButton aria-label="share">
                    <Share03/>
                  </IconButton>
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
              lg={3.5}
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