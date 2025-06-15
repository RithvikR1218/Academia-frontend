import { useEffect, useState } from 'react';
import { Select } from '@mantine/core';
import { getColleges } from '../api/proff_search';

export default function College({ value, onChange }) {
  const [institutes, setInstitutes] = useState([]);

  useEffect(() => {
    getColleges()
      .then((data) =>
        setInstitutes(
          data.map((insti) => ({
            value: insti._id,
            label: insti.name,
          }))
        )
      )
      .catch(console.error);
  }, []);

  return (
    <Select
      label="Select Institute"
      placeholder="Pick an institute"
      data={institutes}
      value={value}
      onChange={(_val, option) => onChange(option)}
      clearable
      searchable
    />
  );
}