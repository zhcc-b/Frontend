export const paths = {
  index: '/',
  roomDetails: '/room/:roomId',
  dashboard: {
    index: '/dashboard',
    room: {
      index: '/dashboard/room',
      roomList: '/dashboard/room/my-room-list',
      roomCreate: '/dashboard/room/create',
    },
    account: '/dashboard/account',
    profile: '/dashboard/user-profile',
    chat: '/dashboard/chat',
  },
  login: '/login',
  register: '/register',
  notAuthorized: '/401',
  notFound: '/404',
  serverError: '/500',
};
