import PropTypes from 'prop-types';
import {format} from 'date-fns';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {RouterLink} from 'src/components/router-link';
import {paths} from 'src/paths';
import Calendar from '@untitled-ui/icons-react/build/esm/Calendar';
import UsersCheck from '@untitled-ui/icons-react/build/esm/UsersCheck';
import CardHeader from "@mui/material/CardHeader";


export const RoomCard = (props) => {
  const {
    roomId,
    authorAvatar,
    authorName,
    category,
    cover,
    publishedAt,
    shortDescription,
    title,
    ...other
  } = props;

  const formattedPublishedAt = format(publishedAt, 'MMM d, yyyy');

  return (
    <Card
      {...other}
      sx={{height: '100%'}}
    >
      <CardHeader
        avatar={
          <Avatar src={authorAvatar}/>
        }
        title={authorName}
        subheader={'Published on ' + formattedPublishedAt}
      />
      <CardMedia
        component={RouterLink}
        href={`${paths.roomDetails.replace(':roomId', roomId)}`}
        image={cover}
        sx={{height: 200, position: 'relative'}} // Set position to relative
      />
      <CardContent>
        <Box sx={{mb: 2}}>
          <Chip label={category}/>
        </Box>
        <Link
          color="text.primary"
          component={RouterLink}
          href={`${paths.roomDetails.replace(':roomId', roomId)}`}
        >
          <Typography
            noWrap
            variant="h5"
          >
            {title}
          </Typography>
        </Link>
        {/*<Typography*/}
        {/*  variant="subtitle1"*/}
        {/*  sx={{mt: 1}}*/}
        {/*>*/}
        {/*  Hosted by: {authorName}*/}
        {/*</Typography>*/}
        <Typography
          color="text.secondary"
          sx={{
            height: 48,
            mt: 1,
            display: '-webkit-box', // Necessary for line clamping
            WebkitBoxOrient: 'vertical', // Necessary for line clamping
            WebkitLineClamp: 2, // Limit text to 2 lines
            overflow: 'hidden', // Hide the rest of the text
          }}
          variant="body1"
        >
          {shortDescription}
        </Typography>
        <Stack
          alignItems="center"
          direction="row"
          flexWrap="wrap"
          spacing={2}
          sx={{mt: 2}}
        >
          <Stack
            alignItems="center"
            direction="row"
            spacing={1}
          >
            <Calendar/>
            <Typography variant="subtitle2">
              {formattedPublishedAt}
            </Typography>
          </Stack>

          <Stack
            alignItems="center"
            direction="row"
            spacing={1}
          >
            <UsersCheck/>
            <Typography
              align="right"
              sx={{flexGrow: 1}}
              variant="subtitle2"
            >
              1/2
            </Typography>
          </Stack>

        </Stack>
      </CardContent>
    </Card>
  );
};

RoomCard.propTypes = {
  roomId: PropTypes.string.isRequired,
  authorAvatar: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  publishedAt: PropTypes.number.isRequired,
  shortDescription: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
