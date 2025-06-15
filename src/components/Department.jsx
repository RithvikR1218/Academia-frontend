import { useEffect, useState } from 'react';
import { Select } from '@mantine/core';
import { getAllDepartments, getCollegeDepartments } from '../api/proff_search';

export default function Department({ value, onChange }) {
    const [departments, setDepartments] = useState([]);
  
    useEffect(() => {
      async function fetchDepartments() {
        try {
          if (value) {
            const college = await getCollegeDepartments(value);
            const data = college.departments;
            setDepartments(
              data.map((dept) => ({
                value: dept._id,
                label: dept.name,
              }))
            );
          } else {
            const data = await getAllDepartments();
            setDepartments(
              data.map((dept) => ({
                value: dept._id,
                label: dept.name,
              }))
            );
          }
        } catch (err) {
          console.error(err);
        }
      }
      fetchDepartments();
    }, [value]);
  
    return (
      <Select
        label="Select Department"
        placeholder="Pick Department"
        data={departments}
        clearable
        searchable
        onChange={(_val, option) => onChange(option)}
      />
    );
  }