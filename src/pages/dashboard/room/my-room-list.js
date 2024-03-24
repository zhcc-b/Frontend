import { useCallback, useEffect, useMemo, useState } from 'react';
import Download01Icon from '@untitled-ui/icons-react/build/esm/Download01';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Upload01Icon from '@untitled-ui/icons-react/build/esm/Upload01';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { Seo } from 'src/components/seo';
import { useMounted } from 'src/hooks/use-mounted';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
// import { CustomerListSearch } from 'src/sections/dashboard/customer/customer-list-search';
import { CustomerListTable } from 'src/sections/dashboard/room/customer-list-table';
import { jwtDecode } from 'jwt-decode';


const Page = () => {
  const [eventData, setEvents] = useState([]);
  const router = useRouter();
  useEffect(() => {
    if (router.isReady === false) {
      return;
    }
    // 
    const token = localStorage.getItem('JWT');
    const uid = jwtDecode(token).user_id;
    fetch(`http://localhost:8000/accounts/${uid}/`)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          return response.json();
        } else if (response.status === 401 || response.status === 403) {
          router.push('/401');
        } else if (response.status === 404) {
          router.push('/404');
        } else {
          router.push('/500');
        }
      })
      .then((data) => {
        setEvents(data.own_events);
          
      });
  }, [router]);

  return (
    <>
      <Seo title="Dashboard: Room List" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">MyRoomList</Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  
                </Stack>
              </Stack>
              <Stack
                alignItems="center"
                direction="row"
                spacing={3}
              >
              </Stack>
            </Stack>
            <Card>
              {/*<CustomerListSearch*/}
              {/*  onFiltersChange={customersSearch.handleFiltersChange}*/}
              {/*  onSortChange={customersSearch.handleSortChange}*/}
              {/*  sortBy={customersSearch.state.sortBy}*/}
              {/*  sortDir={customersSearch.state.sortDir}*/}
              {/*/>*/}
              <CustomerListTable
                events={eventData}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
