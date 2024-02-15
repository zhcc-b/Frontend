import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RoomContent } from 'src/sections/rooms/room-content';

export const RoomOverview = (props) => {
  const { room, ...other } = props;

  console.log("Overview", room);

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        <div>
          <Chip label={room.sport.name.charAt(0).toUpperCase() + room.sport.name.slice(1)} />
        </div>
        <Typography variant="h3">{room.title}</Typography>
        <Typography
          color="text.secondary"
          variant="subtitle1"
        >
          {room.description}
        </Typography>
        {/*<Stack*/}
        {/*  alignItems="center"*/}
        {/*  direction="row"*/}
        {/*  spacing={2}*/}
        {/*  sx={{ mt: 3 }}*/}
        {/*>*/}
        {/*  <Avatar src={room.author.avatar} />*/}
        {/*  <div>*/}
        {/*    <Typography variant="subtitle2">*/}
        {/*      By {room.author.name} • {publishedAt}*/}
        {/*    </Typography>*/}
        {/*    <Typography*/}
        {/*      color="text.secondary"*/}
        {/*      variant="body2"*/}
        {/*    >*/}
        {/*      {room.readTime} read*/}
        {/*    </Typography>*/}
        {/*  </div>*/}
        {/*</Stack>*/}
      </Stack>
      <Box
        sx={{
          backgroundImage: `url(${room.attachment})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          borderRadius: 1,
          height: 380,
          mt: 3,
        }}
      />
      {room.content && (
        <Container sx={{ py: 3 }}>
          <RoomContent content={room.content} />
        </Container>
      )}
    </Container>
  );

}

RoomOverview.propTypes = {
  room: PropTypes.object.isRequired,
};
