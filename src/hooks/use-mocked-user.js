export const useMockedUser = () => {
  // To get the user from the authContext, you can use
  // `const { user } = useAuth();`
  return {
    id: '5e86809283e28b96d2d38537',
    avatar: '/assets/avatars/avatar-anika-visser.png',
    username: 'AnikaVisser',
    email: 'anika.visser@devias.io',
    gender: 'Female',
    sports_you_can_play: 'Football, Tennis',
    phone: '1234567890',
    age: '20',
    description: 'This is a sample description.',
    email_product: false,
    email_security: false,
    phone_security: false,
    password: '123',
  };
};
