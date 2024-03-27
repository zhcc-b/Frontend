import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Menu01Icon from '@untitled-ui/icons-react/build/esm/Menu01';
import { alpha } from '@mui/system/colorManipulator';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Logo } from 'src/components/logo';
import { LogoText } from 'src/components/logo-text';
import { RouterLink } from 'src/components/router-link';
import { usePathname } from 'src/hooks/use-pathname';
import { useWindowScroll } from 'src/hooks/use-window-scroll';

import { paths } from 'src/paths';
import { TopNavItem } from './top-nav-item';
import { useRouter } from 'next/navigation';
import { AccountButton } from '../dashboard/account-button';
import { NotificationsButton } from '../dashboard/notifications-button';

const login = [{ title: 'Log in', path: paths.login }];

const TOP_NAV_HEIGHT = 64;

export const TopNav = (props) => {
  const { onMobileNavOpen } = props;
  const pathname = usePathname();
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const [elevate, setElevate] = useState(false);
  const offset = 64;
  const delay = 100;
  const [keyword, setKeyword] = useState('');
  const router = useRouter();
  const isSearch = pathname === '/search';
  const token = localStorage.getItem('JWT');
  const isLogin = token !== null && token !== undefined;

  const handleChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleWindowScroll = useCallback(() => {
    if (window.scrollY > offset) {
      setElevate(true);
    } else {
      setElevate(false);
    }
  }, []);

  useWindowScroll({
    handler: handleWindowScroll,
    delay,
  });

  return (
    <Box
      component="header"
      sx={{
        left: 0,
        position: 'fixed',
        right: 0,
        top: 0,
        pt: 2,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          backdropFilter: 'blur(6px)',
          backgroundColor: (theme) => theme.palette.background.default, // change this line
          borderRadius: 2.5,
          boxShadow: 'none',
          transition: (theme) =>
            theme.transitions.create('box-shadow, background-color', {
              easing: theme.transitions.easing.easeInOut,
              duration: 200,
            }),
          ...(elevate && {
            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
            boxShadow: 8,
          }),
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ height: TOP_NAV_HEIGHT }}
        >
          <Stack
            alignItems="center"
            direction="row"
            sx={{ flexGrow: 1 }}
          >
            <Stack
              alignItems="center"
              component={RouterLink}
              direction="row"
              display="inline-flex"
              href={paths.index}
              sx={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  justifyItems: 'flex-start',
                  display: 'inline-flex',
                  height: 30,
                  width: 30,
                }}
              >
                <Logo />
              </Box>
              <Box
                sx={{
                  justifyItems: 'flex-start',
                  display: 'inline-flex',
                  height: 30,
                  width: 200,
                }}
              >
                <LogoText />
              </Box>
            </Stack>
          </Stack>
          {mdUp && (
            <Stack
              alignItems="center"
              direction="row"
              sx={{ flexGrow: 1 }}
            >
              {!isSearch && (
                <TextField
                  variant="outlined"
                  id={'keyword'}
                  name={'keyword'}
                  value={keyword}
                  fullWidth
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      router.push(`/search?keywords=${keyword}`);
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <>
                        <SearchIcon style={{ marginRight: 8, color: 'gray' }} />
                      </>
                    ),
                  }}
                  placeholder="Title, description or content..."
                />
              )}
            </Stack>
          )}
          {!isLogin ? (
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="flex-end"
              sx={{ flexGrow: 1 }}
            >
              {login.map((item) => {
                const checkPath = !!(item.path && pathname);
                const partialMatch = checkPath ? pathname.includes(item.path) : false;
                const exactMatch = checkPath ? pathname === item.path : false;
                const active = item.popover ? partialMatch : exactMatch;

                return (
                  <TopNavItem
                    active={active}
                    external={item.external}
                    key={item.title}
                    path={item.path}
                    popover={item.popover}
                    title={item.title}
                  />
                );
              })}
              <Button
                component={RouterLink}
                href={paths.register}
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
                Sing up
              </Button>
              {!mdUp && (
                <IconButton onClick={onMobileNavOpen}>
                  <SvgIcon fontSize="small">
                    <Menu01Icon />
                  </SvgIcon>
                </IconButton>
              )}
            </Stack>
          ) : (
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="flex-end"
              sx={{ flexGrow: 1 }}
            >
              <NotificationsButton />
              <AccountButton />
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

TopNav.propTypes = {
  onMobileNavOpen: PropTypes.func,
};
