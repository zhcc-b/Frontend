import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { PropertyList } from 'src/components/property-list';
import { PropertyListItem } from 'src/components/property-list-item';
// import { getInitials } from 'src/utils/get-initials';

export const RoomSummary = (props) => {
  const { room, ...other } = props;

  console.log(room);

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
            label="Start Time"
            sx={{
              px: 0,
              py: 1,
            }}
            value={new Date(room.start_time).toLocaleString()}
          />
          <PropertyListItem
            align="vertical"
            label="End Time"
            sx={{
              px: 0,
              py: 1,
            }}
            value={new Date(room.end_time).toLocaleString()}
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
        {/*TODO: Add Admins and Owners*/}
        <Divider sx={{ my: 2 }} />
        <Typography
          color="text.secondary"
          component="p"
          sx={{ mb: 2 }}
          variant="overline"
        >
          Admins
        </Typography>
        {/*<Stack spacing={2}>*/}
        {/*  {(company.founders || []).map((founder) => (*/}
        {/*    <Stack*/}
        {/*      alignItems="center"*/}
        {/*      direction="row"*/}
        {/*      key={founder.id}*/}
        {/*      spacing={2}*/}
        {/*    >*/}
        {/*      <Avatar src={founder.avatar}>{getInitials(founder.name)}</Avatar>*/}
        {/*      <div>*/}
        {/*        <Typography variant="subtitle2">{founder.name}</Typography>*/}
        {/*        <Typography*/}
        {/*          color="text.secondary"*/}
        {/*          variant="body2"*/}
        {/*        >*/}
        {/*          {founder.role}*/}
        {/*        </Typography>*/}
        {/*      </div>*/}
        {/*    </Stack>*/}
        {/*  ))}*/}
        {/*</Stack>*/}
      </CardContent>
    </Card>
  );
};

RoomSummary.propTypes = {
  room: PropTypes.object.isRequired,
};
