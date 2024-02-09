export const paths = {
  index: '/',
  account: '/account',
  dashboard: {
    index: '/dashboard',
    room: {
      index: '/dashboard/room',
      roomList: '/dashboard/room/my-room-list',
      roomCreate: '/dashboard/room/create',
      roomDetails: '/dashboard/room/:roomId',
    },
    social: {
      profile: '/dashboard/social/profile',
    },
    chat: '/dashboard/chat',
  },
  auth: {
    jwt: {
      login: '/auth/jwt/login',
      register: '/auth/jwt/register',
    },
  },
  notAuthorized: '/401',
  notFound: '/404',
  serverError: '/500',
};
