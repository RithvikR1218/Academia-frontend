import { useState } from 'react';
import { Button } from '@mantine/core';
import College from '../components/College';
import Department from '../components/Department';
import ProfTable from '../components/ProfTable';

export default function Search() {
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
          setSelectedDepartment(null);
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