import { useCallback, useState } from 'react';
import { subDays, subHours, subMinutes, subMonths } from 'date-fns';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { AccountGeneralSettings } from 'src/sections/dashboard/account/account-general-settings';
import { AccountNotificationsSettings } from 'src/sections/dashboard/account/account-notifications-settings';
import { AccountSecuritySettings } from 'src/sections/dashboard/account/account-security-settings';

const now = new Date();

const tabs = [
  { label: 'General', value: 'general' },
  { label: 'Notifications', value: 'notifications' },
  { label: 'Security', value: 'security' },
];

const Page = () => {
  const [currentTab, setCurrentTab] = useState('general');
  const adminUser = 'admin';
  function getUser(username) {
    const url = `http://localhost:8000/userprofile/edit-profile/?username=${encodeURIComponent(
      username
    )}`;

    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response
      })
      .catch((error) => {
        console.error('Error:', error);
        throw error;
      });
  }

  const user = getUser(adminUser).catch((error) => {
    console.error('Request failed:', error.message);
  });
  const mockUser = useMockedUser();

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  return (
    <>
      <Seo title="Dashboard: Account" />
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
            <Typography variant="h4">Account</Typography>
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
          {currentTab === 'general' && (
            <AccountGeneralSettings
              avatar={mockUser.avatar || ''}
              email={mockUser.email || ''}
              phone={mockUser.phone || ''}
              username={mockUser.username || ''}
              gender={mockUser.gender || ''}
              sports={mockUser.sports_you_can_play.split(', ') || []}
              age={mockUser.age}
              description={mockUser.description}
            />
          )}
          {currentTab === 'notifications' && (
            <AccountNotificationsSettings
              email_product={mockUser.email_product}
              email_security={mockUser.email_security}
              phone_security={mockUser.phone_security}
            />
          )}
          {currentTab === 'security' && <AccountSecuritySettings />}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
