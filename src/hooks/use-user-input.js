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
    setValues(prevValues => {
      if (name === 'startTime' && prevValues.endTime && newValue > prevValues.endTime) {
        return {
          ...prevValues,
          [name]: newValue,
          endTime: null
        };
      } else {
        return {
          ...prevValues,
          [name]: newValue
        };
      }
    });
  };

  const handleAutocompleteChange = (name, newValue) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleEditorChange = (content) => {
    const isEditorEmpty = content === '<p><br></p>';

    handleInputChange({
      target: {
        name: 'content',
        value: isEditorEmpty ? '' : content
      }
    });
  };

  console.log(values);

  return [values, setValues, handleInputChange, handleDateChange, handleEditorChange, handleAutocompleteChange];
}

export default useUserInput;
