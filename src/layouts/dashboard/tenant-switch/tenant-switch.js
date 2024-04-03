import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export const TenantSwitch = (props) => {

  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
        {...props}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            color="inherit"
            variant="h6"
          >
            PlayPal
          </Typography>
          <Typography
            color="neutral.400"
            variant="body2"
          >
            Sport App
          </Typography>
        </Box>
      </Stack>
    </>
  );
};
