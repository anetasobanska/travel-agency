export const fields = [
  {
    name: 'name',
    label: 'First name and last name',
    required: true,
    pattern: '^[a-zA-Z –-]+$',
  },
  {
    name: 'email',
    label: 'Email',
    required: true,
    pattern: '^[a-z0-9]+@[a-z]+.[a-z]{2,3}$',
  },
];
