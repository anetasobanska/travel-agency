export function validate(fields, data) {
  const errors = [];

  fields.forEach(function (field) {
    const value = data[field.name].value;

    if (field.required) {
      if (value.length === 0) {
        errors.push('Dane w polu ' + field.label + ' są wymagane.');
      }
    }

    if (field.type === 'number') {
      if (Number.isNaN(Number(value))) {
        errors.push('Dane w polu ' + field.label + ' muszą być liczbą.');
      }
    }

    if (field.pattern) {
      const reg = new RegExp(field.pattern);
      if (!reg.test(value)) {
        errors.push(
          'Dane w polu ' +
            field.label +
            ' zawierają niedozwolone znaki lub nie są zgodne z przyjętym w Polsce wzorem.'
        );
      }
    }
  });

  return errors;
}
