import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { RoomCard } from '../rooms/room-card';
import { Button } from '@mui/material';

const QuotesIcon = () => (
  <svg
    fill="none"
    height="79"
    viewBox="0 0 105 79"
    width="105"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_17690_94764)">
      <path
        d="M25.086 78.1818C20.265 78.1818 15.971 76.9768 12.204 74.5658C8.437 72.0048 5.424 68.4638 3.164 63.9438C1.054 59.4238 0 54.3008 0 48.5758C0 43.3028 0.904 38.1798 2.712 33.2078C4.671 28.2358 7.458 23.6408 11.074 19.4218C14.6576 15.0819 18.8433 11.2767 23.504 8.12177C28.325 4.80677 33.599 2.39677 39.324 0.889771L50.398 14.6758C43.919 17.2368 38.721 20.6268 34.804 24.8458C31.037 29.0648 29.154 32.6808 29.154 35.6938C29.154 37.0498 29.531 38.5568 30.284 40.2138C31.188 41.7208 32.921 43.3028 35.482 44.9598C39.249 47.3698 41.81 49.9318 43.166 52.6438C44.673 55.2048 45.426 58.1438 45.426 61.4578C45.426 66.5808 43.467 70.6478 39.55 73.6618C35.783 76.6748 30.962 78.1818 25.086 78.1818V78.1818ZM79.326 78.1818C74.505 78.1818 70.211 76.9768 66.444 74.5658C62.677 72.0048 59.664 68.4638 57.404 63.9438C55.294 59.4238 54.24 54.3008 54.24 48.5758C54.24 43.3028 55.144 38.1798 56.952 33.2078C58.911 28.2358 61.698 23.6408 65.314 19.4218C68.8976 15.0819 73.0833 11.2767 77.744 8.12177C82.565 4.80677 87.839 2.39677 93.564 0.889771L104.638 14.6758C98.159 17.2368 92.961 20.6268 89.044 24.8458C85.277 29.0648 83.394 32.6808 83.394 35.6938C83.394 37.0498 83.771 38.5568 84.524 40.2138C85.428 41.7208 87.161 43.3028 89.722 44.9598C93.489 47.3698 96.05 49.9318 97.406 52.6438C98.913 55.2048 99.666 58.1438 99.666 61.4578C99.666 66.5808 97.707 70.6478 93.79 73.6618C90.023 76.6748 85.202 78.1818 79.326 78.1818V78.1818Z"
        fill="black"
        fillOpacity="0.04"
      />
    </g>
    <defs>
      <clipPath id="clip0_17690_94764">
        <rect
          fill="white"
          height="78.0005"
          transform="translate(0 0.889771)"
          width="105"
        />
      </clipPath>
    </defs>
  </svg>
);

export const HomeEvents = (props) => {
  const router = useRouter();
  const { events } = props;
  const eventToShow = [];
  function handleOnClick() {
    if (router.isReady === false) {
      return;
    } else {
      router.push('/search');
    }
  }

  for (let i = 0; i < events.length; i++) {
    eventToShow.push({
      roomId: events[i].id,
      authorAvatar: events[i].owner.avatar,
      authorName: events[i].owner.username,
      category: events[i].sport.name,
      cover: null,
      publishedAt: events[i].created_at,
      shortDescription: events[i].description,
      title: events[i].title,
      currentPlayer: events[i].players.length,
      maxPlayer: events[i].max_players,
      startTime: events[i].start_time,
      endTime: events[i].end_time,
      attachment: events[i].attachment,
    });
  }

  return (
    <Box
      sx={{
        backgroundColor: 'neutral.800',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        alignItems: 'center',
        color: 'neutral.100',
        py: '120px',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          spacing={8}
          sx={{ py: '10px' }}
        >
          <Stack spacing={2}>
            <Typography
              align="center"
              variant="h3"
            >
              Current events
            </Typography>
            <Typography
              align="center"
              color="text.secondary"
              variant="subtitle1"
            >
              Join the events now!
            </Typography>
          </Stack>
          <Stack spacing={2}>
            <Grid
              container
              spacing={3}
            >
              {eventToShow.map((event, index) => (
                <Grid
                  key={index}
                  xs={12}
                  md={6}
                  lg={4}
                >
                  <Card sx={{ height: '100%' }}>
                    <RoomCard
                      roomId={event.roomId.toString()}
                      authorAvatar={event.authorAvatar}
                      authorName={event.authorName}
                      category={event.category}
                      publishedAt={event.publishedAt.toString()}
                      shortDescription={event.shortDescription}
                      title={event.title}
                      currentPlayer={event.currentPlayer.toString()}
                      maxPlayer={event.maxPlayer.toString()}
                      startTime={event.startTime.toString()}
                      endTime={event.endTime.toString()}
                      cover={event.attachment}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
          <Stack>
            <Button onClick={handleOnClick}>More events</Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
