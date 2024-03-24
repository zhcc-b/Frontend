import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { ProfileGeneral } from 'src/sections/dashboard/profile/profile-general';
import { ProfileRoomList } from 'src/sections/dashboard/profile/profile-room';
import { useRouter } from 'next/navigation';
import sendHttpRequest from 'src/utils/send-http-request';
import useUserInput from 'src/hooks/use-user-input';
import { jwtDecode } from 'jwt-decode';

const tabs = [
  { label: 'General', value: 'general' },
  { label: 'RoomList', value: 'roomlist' },
];

const Page = () => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('general');
  const token = localStorage.getItem('JWT');

  let initialUserInfo = {
    username: '',
    avatar_data: '',
    email: '',
    gender: '',
    sports_data: '',
    phone_no: '',
    age: '',
    description: '',
    email_product: false,
    email_security: false,
    phone_security: false,
  };
  const uid = jwtDecode(token).user_id;
  const [userData, setUserData, handleInputChange] = useUserInput(initialUserInfo);

  useEffect(() => {
    if (router.isReady === false) {
      return;
    }

    sendHttpRequest(`http://localhost:8000/accounts/${uid}/`, 'GET').then((response) => {
      if (response.status === 200 || response.status === 201) {
        const originalData = {
          email: response.data.email,
          username: response.data.username,
          gender: response.data.gender,
          sports_data: response.data.sports_you_can_play,
          phone_no: response.data.phone_no,
          age: response.data.age,
          description: response.data.description,
          email_product: response.data.email_product,
          email_security: response.data.email_security,
          phone_security: response.data.phone_security,
          avatar_data: response.data.avatar,
        };
        setUserData(originalData);
      } else if (response.status === 401 || response.status === 403) {
        router.push('/401');
      } else if (response.status === 404) {
        router.push('/404');
      } else {
        router.push('/500');
      }
    });
  }, [uid, setUserData, router]);

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  return (
    <>
      <Seo title="Dashboard: Profile" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack
            spacing={3}
            sx={{ mb: 3 }}
          >
            <Typography variant="h4">Profile</Typography>
            <div>
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
                  />
                ))}
              </Tabs>
              <Divider />
            </div>
          </Stack>
          {currentTab === 'general' && <ProfileGeneral userData={userData || null} />}
          {currentTab === 'security' && <ProfileRoomList />}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
