import { useState } from 'react';

export function useUserInput(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleInputChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleDateChange = (name, newValue) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  console.log(values);

  return [values, handleInputChange, handleDateChange];
}

export default useUserInput;
