import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Seo } from 'src/components/seo';
import { ProfileGeneral } from 'src/sections/dashboard/profile/profile-general';
import { useRouter } from "next/router";
import sendHttpRequest from 'src/utils/send-http-request';
import useUserInput from 'src/hooks/use-user-input';

const Page = () => {
  const router = useRouter();
  const {userId} = router.query;

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

  const [userData, setUserData] = useUserInput(initialUserInfo);

  useEffect(() => {
    if (router.isReady && userId) {
      sendHttpRequest(`http://localhost:8000/accounts/${userId}/`, 'GET').then((response) => {
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
    }
  }, [userId, setUserData, router]);

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
            <Typography variant="h4">{userData.username}&apos;s Profile</Typography>
            <ProfileGeneral userData={userData || null} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
