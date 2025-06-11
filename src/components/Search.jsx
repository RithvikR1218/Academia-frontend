import { useEffect, useState } from 'react';
import { Select, Table, Loader, Button } from '@mantine/core';
import {getAllDepartments, getColleges, getCollegeDepartments, getProfessors} from '../api/proff_search.js'

function College({ value, onChange }) {
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

function Department({ value, onChange }) {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        if (value) {
          const college = await getCollegeDepartments(value);
          const data = college.departments
          // `data` is an array of department objects if populated
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
      onChange={(_val, option) => onChange(option)} // <-- this line is crucial

    />
  );
}

export function ProfTable({ collegeId, departmentId }) {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProfessors({ collegeId, departmentId })
      .then(setProfessors)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [collegeId, departmentId]);

  if (loading) return <Loader />;

  const rows = professors.map((prof) => (
    <tr key={prof._id}>
      <td>{prof.name}</td>
      <td>{prof.email}</td>
      <td>{prof.collegeId?.name || 'N/A'}</td>
      <td>{prof.departmentId?.name || 'N/A'}</td>
      <td>{prof.position}</td>
      <td>{prof.researchInterests?.join(', ')}</td>
    </tr>
  ));

  return (
    <Table striped highlightOnHover withTableBorder withColumnBorders>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>College</th>
          <th>Department</th>
          <th>Position</th>
          <th>Research Interests</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

export function Search() {
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [filters, setFilters] = useState({ collegeId: null, departmentId: null });

  const handleSearch = () => {
    setFilters({
      collegeId: selectedInstitute?.value || null,
      departmentId: selectedDepartment?.value || null,
    });
    setShowTable(true);
  };

  return (
    <div>
      <College
        value={selectedInstitute?.value || null}
        onChange={(option) => {
          setSelectedInstitute(option);
          setSelectedDepartment(null); // reset department when college changes
        }}
      />

      <Department
        value={selectedInstitute?.value}
        onChange={(option) => setSelectedDepartment(option)}
      />

      <Button onClick={handleSearch} mt="md">
        Search Professors
      </Button>

      {showTable && (
        <ProfTable
          collegeId={filters.collegeId}
          departmentId={filters.departmentId}
        />
      )}
    </div>
  );
}