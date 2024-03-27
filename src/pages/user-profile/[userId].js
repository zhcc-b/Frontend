import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { ProfileGeneral } from 'src/sections/dashboard/profile/profile-general';
import { useRouter } from 'next/navigation';
import sendHttpRequest from 'src/utils/send-http-request';
import useUserInput from 'src/hooks/use-user-input';
import { jwtDecode } from 'jwt-decode';
import {useSearchParams} from 'src/hooks/use-search-params';

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
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
          avatar_data: response.data.avatar,
        };
        setUserData(originalData);
      } else if (response.status === 401 || response.status === 403) {
        router.push('/login');
      } else if (response.status === 404) {
        router.push('/404');
      } else {
        router.push('/500');
      }
    });
  }, [uid, setUserData, router]);
  return (
    <>
      <Seo title="Dashboard: Personal Information" />
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
            <Typography variant="h4">User Profile</Typography>

            <ProfileGeneral userData={userData || null} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
