import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';

export const HomeHero = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        alignItems: 'center',
        py: '120px',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          spacing={8}
          sx={{ py: '10px' }}
        >
          <Box maxWidth="sm">
            <Stack
              alignItems="flex-start"
              spacing={2}
            >
              <Typography
                variant="h1"
                sx={{ mb: 2 }}
              >
                You don't have to&nbsp;
                <Typography
                  component="span"
                  color="primary.main"
                  variant="inherit"
                >
                  sports alone!&nbsp;
                </Typography>
              </Typography>
              <Typography
                color="text.secondary"
                sx={{
                  fontSize: 20,
                  fontWeight: 500,
                }}
              >
                Discover your perfect sports match and elevate your game – our app connects you with
                like-minded individuals, making it easier than ever to find companions for your
                favorite sports activities. Join now and unleash the joy of playing sports together!
              </Typography>
              <Button
                component={RouterLink}
                href={paths.login}
                sx={(theme) =>
                  theme.palette.mode === 'dark'
                    ? {
                        backgroundColor: 'neutral.50',
                        color: 'neutral.900',
                        '&:hover': {
                          backgroundColor: 'neutral.200',
                        },
                      }
                    : {
                        backgroundColor: 'neutral.900',
                        color: 'neutral.50',
                        '&:hover': {
                          backgroundColor: 'neutral.700',
                        },
                      }
                }
                variant="contained"
              >
                Join now!
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};
