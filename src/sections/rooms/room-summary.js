import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { PropertyList } from 'src/components/property-list';
import { PropertyListItem } from 'src/components/property-list-item';
import {formatDateTime} from "src/utils/format-datetime";
// import { getInitials } from 'src/utils/get-initials';

const ageGroupMapping = {
  C: 'Children',
  T: 'Teenagers',
  A: 'Adults',
  S: 'Seniors'
};

const skillMapping = {
  B: 'Beginner',
  I: 'Intermediate',
  A: 'Advanced',
  P: 'Professional'
};

export const RoomSummary = (props) => {
  const { room, ...other } = props;

  return (
    <Card {...other}>
      <CardContent>
        <Typography
          color="text.secondary"
          component="p"
          sx={{ mb: 2 }}
          variant="overline"
        >
          About
        </Typography>
        <PropertyList>
          <PropertyListItem
            align="vertical"
            label="Activity"
            sx={{
              px: 0,
              py: 1,
            }}
            value={room.sport.name.charAt(0).toUpperCase() + room.sport.name.slice(1) + ' (' + ageGroupMapping[room.age_group] + ')'}
          />
          <PropertyListItem
            align="vertical"
            label="Skill Level"
            sx={{
              px: 0,
              py: 1,
            }}
            value={skillMapping[room.level]}
          />
          <PropertyListItem
            align="vertical"
            label="Duration"
            sx={{
              px: 0,
              py: 1,
            }}
            value={formatDateTime(room.start_time, room.end_time)}
          />
          <PropertyListItem
            align="vertical"
            label="Location"
            sx={{
              px: 0,
              py: 1,
            }}
          >
            {(room.location.split(',') || []).map((location) => (
              <Typography
                key={location}
                color="text.secondary"
                variant="body2"
              >
                {location.trim()}
              </Typography>
            ))}
          </PropertyListItem>
        </PropertyList>
        <Divider sx={{ my: 2 }} />
        <Typography
          color="text.secondary"
          component="p"
          sx={{ mb: 2 }}
          variant="overline"
        >
          Admins
        </Typography>
        <Stack spacing={2}>
          {(room.admins).map((admin) => (
            <Stack
              alignItems="center"
              direction="row"
              key={admin.id}
              spacing={2}
            >
              <Avatar src={admin.avatar}></Avatar>
              <div>
                <Typography variant="subtitle2">{admin.username}</Typography>
                {/*<Typography*/}
                {/*  color="text.secondary"*/}
                {/*  variant="body2"*/}
                {/*>*/}
                {/*  {admin.description}*/}
                {/*</Typography>*/}
              </div>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

RoomSummary.propTypes = {
  room: PropTypes.object.isRequired,
};
