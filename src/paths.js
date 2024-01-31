export const paths = {
  index: '/',
  account: '/account',
  dashboard: {
    room: {
      index: '/dashboard/room',
      roomList: '/dashboard/room/my-room-list',
      roomCreate: '/dashboard/room/create',
      roomDetails: '/dashboard/room/:roomId',
    },
    chat: '/dashboard/chat',
  },
  notAuthorized: '/401',
  notFound: '/404',
  serverError: '/500',
};
