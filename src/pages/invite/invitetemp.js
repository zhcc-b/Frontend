import { useFormik } from 'formik';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormLabel from '@mui/material/FormLabel';
import Link from '@mui/material/Link';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { Layout as InviteLayout } from 'src/layouts/invite/classic-layout';
import { paths } from 'src/paths';
import {useEffect, useState} from "react";
import sendHttpRequest from "../../utils/send-http-request";
import {useRouter} from "next/router";
import jwtDecode from "jwt-decode";
import confetti from "canvas-confetti";



const Page = () => {
  const router = useRouter();
  const { inviteId } = router.query;
  const [roomname, setroomname] = useState(null);

  useEffect(() => {
    if (inviteId === null || typeof inviteId !== 'string') return;

    // Decode roomId from the inviteId
    const decoderoomId = atob(inviteId);
    const parts = decoderoomId.split('=');
    const roomId = parts[1];

    // Call the GET room API to make sure room exist
    sendHttpRequest(
      `http://localhost:8000/events/${roomId}/`,
      'GET'
    ).then(response => {
      if (response.status === 200 || response.status === 201) {
         setroomname(response.data.title);
      } else if (response.status === 401 || response.status === 403) {
        router.push('/401');
      } else if (response.status === 404) {
        router.push('/404');
      } else {
        router.push('/500');
      }
    });
  }, [inviteId, router]);

  function handleJoin() {
    const token = localStorage.getItem('jwttoken');
    if (!token) {
      const returnTo = encodeURIComponent(window.location.href);
      window.location.href = `/auth/jwt/login?returnTo=${returnTo}`;
    } else {
      const user_id = jwtDecode(token).user_id;
      sendHttpRequest(
        'http://localhost:8000/events/join/',
        'PUT',
        {id: user_id}
      ).then(response =>{
        if (response.status === 200 || response.status === 201) {
          router.push(paths.roomDetails);
        } else if (response.status === 401) {
          router.push('/401');
        }
      }).catch(error => {
        console.error('Request failed', error);
        // Handle the error appropriately
      });
    }
  }

  const formik = useFormik({
    onSubmit: () => {handleJoin()},
  });

  return (
    <>
      <Seo title="Verify Code" />
      <div>
        <Box sx={{ mb: 4 }}>
          <Link
            color="text.primary"
            component={RouterLink}
            href={paths.dashboard.index}
            sx={{
              alignItems: 'center',
              display: 'inline-flex',
            }}
            underline="hover"
          >
            <SvgIcon sx={{ mr: 1 }}>
              <ArrowLeftIcon />
            </SvgIcon>
            <Typography variant="subtitle2">Back to Home Page</Typography>
          </Link>
        </Box>
        <Card elevation={16}>
          <CardHeader
            sx={{ pb: 0 }}
            title="Let's Pal !"
          />
          <CardContent>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
                <FormLabel
                  sx={{
                    display: 'block',
                    mb: 2,
                    fontSize: '1rem',
                  }}
                >
                  Room Name: <span>{roomname}</span>
                </FormLabel>
              <Button
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                type="submit"
                startIcon={
                  <SvgIcon>
                    <SentimentSatisfiedAltIcon />
                  </SvgIcon>
                }
                variant="contained"
              >
                Join the room
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

Page.getLayout = (page) => <InviteLayout>{page}</InviteLayout>;

export default Page;
