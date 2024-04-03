import { useMemo } from 'react';
import SvgIcon from '@mui/material/SvgIcon';

import HomeSmileIcon from 'src/icons/untitled-ui/duocolor/home-smile';
import LayoutAlt02Icon from 'src/icons/untitled-ui/duocolor/layout-alt-02';
import { tokens } from 'src/locales/tokens';
import { paths } from 'src/paths';

export const useSections = () => {
  // const { t } = useTranslation();

  return useMemo(() => {
    return [
      {
        items: [
          {
            title: tokens.nav.account,
            path: paths.dashboard.account,
            icon: (
              <SvgIcon fontSize="small">
                <HomeSmileIcon />
              </SvgIcon>
            ),
          },
          {
            title: tokens.nav.room,
            path: paths.dashboard.room.index,
            icon: (
              <SvgIcon fontSize="small">
                <LayoutAlt02Icon />
              </SvgIcon>
            ),
            items: [
              {
                title: tokens.nav.roomList,
                path: paths.dashboard.room.roomList,
              },
              {
                title: tokens.nav.roomCreate,
                path: paths.dashboard.room.roomCreate,
              },
            ],
          },
        ],
      },
    ];
  }, []);
};
