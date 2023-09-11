export const fields = [
  {
    name: 'name',
    label: 'Imię i nazwisko',
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
