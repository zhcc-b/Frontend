import { useState } from 'react';

export function useUserInput(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleInputChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  console.log('values', values)

  return [values, handleInputChange];
}

export default useUserInput;
