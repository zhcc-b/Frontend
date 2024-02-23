export const paths = {
  index: '/',
  account: '/account',
  roomDetails: '/room/:roomId',
  dashboard: {
    index: '/dashboard',
    room: {
      index: '/dashboard/room',
      roomList: '/dashboard/room/my-room-list',
      roomCreate: '/dashboard/room/create',
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
