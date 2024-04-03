import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from "@mui/material/Chip";
import Link from '@mui/material/Link';
import { RouterLink } from "../../components/router-link";

export const MemberCard = (props) => {
  const { member } = props;

  return (
    <Box
      sx={{
        borderColor: 'divider',
        borderRadius: 1,
        borderStyle: 'solid',
        borderWidth: 1,
        px: 3,
        py: 4,
      }}
    >
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        <Avatar src={member.avatar}></Avatar>
        <div>
          <Typography variant="subtitle2">
            <Link
              color="text.primary"
              component={RouterLink}
              href={`/user-profile/${member.id}`}
              underline="always"
            >
              {member.username}
            </Link>
          </Typography>
        </div>
      </Stack>
      {member.sports_you_can_play.length > 0 ? (
        <Stack
          alignItems="center"
          direction="row"
          flexWrap="wrap"
          spacing={1}
          sx={{ mt: 2 }}
        >
          {member.sports_you_can_play.map((sport) => (
            <Chip
              key={sport.name}
              label={sport.name}
              size="small"
            />
          ))}
        </Stack>
      ) : null}
    </Box>
  );
};

MemberCard.propTypes = {
  member: PropTypes.object.isRequired,
};
