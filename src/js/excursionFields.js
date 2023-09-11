export const excursionFields = [
  {
    name: 'name',
    label: 'Nazwa',
    required: true,
    pattern: '^[a-zA-Z –-]+$',
  },
  {
    name: 'description',
    label: 'Opis',
    required: true,
    pattern: '^[a-zA-Z –-]+$',
  },
  {
    name: 'adult',
    label: 'Cena dorosły',
    required: true,
    type: 'number',
  },
  {
    name: 'child',
    label: 'Cena dziecko',
    required: true,
    type: 'number',
  },
];
