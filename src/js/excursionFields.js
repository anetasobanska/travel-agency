export const excursionFields = [
  {
    name: 'name',
    label: 'Name',
    required: true,
    pattern: '^[a-zA-Z –-]+$',
  },
  {
    name: 'description',
    label: 'Description',
    required: true,
    pattern: '^[a-zA-Z –-]+$',
  },
  {
    name: 'adult',
    label: 'Price adult',
    required: true,
    type: 'number',
  },
  {
    name: 'child',
    label: 'Price child',
    required: true,
    type: 'number',
  },
];
