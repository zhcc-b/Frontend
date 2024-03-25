import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Button, TextField} from '@mui/material';

import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as MarketingLayout} from 'src/layouts/marketing';
import {PricingPlanIcon} from 'src/sections/pricing/pricing-plan-icon';
import sendHttpRequest from 'src/utils/send-http-request';


const Page = () => {
  usePageView();

  const [eventId, setEventId] = useState('');
  const [boostAmount, setBoostAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const roomid = queryParams.get('roomid');
    const token = queryParams.get('token');

    if (roomid) {
      setEventId(roomid);
    }

    if (token) {
      verifyPaymentToken(token);
    }
  }, []);

  const handlePayment = async () => {
    if (!boostAmount) {
      setErrorMessage('Boost Amount is required');
      return;
    }

    const data = {
      event_id: eventId,
      amount: boostAmount,
      return_url: 'http://localhost:3000/pricing?state=success',
      cancel_url: `http://localhost:3000/pricing?roomid=${eventId}&state=cancel`,
    };

    const { status, data: responseData } = await sendHttpRequest(
      'http://localhost:8000/payments/create/',
      'POST',
      data
    );

    if (status === 200) {
      window.location.href = responseData.link; // Redirect to the link provided in the response
    } else {
      setErrorMessage('Failed to create payment. Please try again.');
    }
  };

  const verifyPaymentToken = async (token) => {
    const { status, data } = await sendHttpRequest(
      `http://localhost:8000/payments/verify/?token=${token}`,
      'GET'
    );

    if (status === 200) {
      console.log('Verification successful:', data);
      // Check if the payment status is APPROVED
      if (data.status === "APPROVED") {
        // Redirect to the dashboard page
        window.location.href = 'http://localhost:3000/dashboard/room/my-room-list';
      } else {
        // Handle other statuses accordingly
        console.error('Payment not approved:', data);
        setErrorMessage('Payment not approved. Please try again.');
      }
    } else {
      console.error('Verification failed:', data);
      setErrorMessage('Payment verification failed. Please try again.');
    }
  };

  return (
    <>
      <Seo title="Pricing" />
      <Box component="main"
           sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
            pb: '120px',
            pt: '184px',
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                mb: 4,
              }}
            >
              <Typography variant="h3">Start today. Boost up your Event!</Typography>
              <Typography color="text.secondary"
                          sx={{my: 2}}
                          variant="body1"></Typography>
            </Box>
            <Grid container
                  spacing={4}
                  justifyContent="center"> {/* Center the grid */}
              <Grid item
                    xs={12}
                    sm={8}
                    md={6}>
                <Box
                  sx={{
                    height: '100%',
                    maxWidth: 460,
                    mx: 'auto', // Centers the box
                    padding: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h5"
                              gutterBottom>
                    Premium for room {eventId} {/* Dynamically showing roomid */}
                  </Typography>
                  <PricingPlanIcon name="Premium" />
                  <Typography variant="body2">
                    To familiarize yourself with our web.
                  </Typography>
                  <Stack spacing={2}
                         sx={{mt: 2}}>
                    <TextField
                      label="Boost Amount"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={boostAmount}
                      onChange={(e) => setBoostAmount(e.target.value)}
                      inputProps={{ min: 1 }}
                    />
                    <Button variant="contained"
                            color="primary"
                            onClick={handlePayment}>
                      Start Boost Now
                    </Button>
                    {errorMessage && (
                      <Typography color="error"
                                  variant="body2">
                        {errorMessage}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
              <Typography align="center"
                          color="text.secondary"
                          component="p"
                          variant="caption">
                Looking for partners with our platform.
              </Typography>
            </Box>
          </Container>
        </Box>
        <Divider />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default Page;
