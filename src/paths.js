export const paths = {
  index: '/',
  roomDetails: '/room/:roomId',
  dashboard: {
    index: '/dashboard/account',
    room: {
      index: '/dashboard/room',
      roomList: '/dashboard/room/my-room-list',
      roomCreate: '/dashboard/room/create',
      roomEdit: '/dashboard/room/edit',
    },
    account: '/dashboard/account',
  },
  userProfile: '/user-profile/:userId',
  login: '/login',
  register: '/register',
  notAuthorized: '/401',
  notFound: '/404',
  serverError: '/500',
  pricing: '/pricing',
};
