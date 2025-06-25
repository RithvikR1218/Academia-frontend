import { useState, useEffect } from 'react';
import { Button, TextInput } from '@mantine/core';
import College from '../components/College';
import Department from '../components/Department';
import ProfTable from '../components/ProfTable';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
const baseURL = import.meta.env.VITE_BACKEND_URL;

export default function Search() {
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [researchInterest, setResearchInterest] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({
    collegeId: null,
    departmentId: null,
    researchInterests: '',
  });

  const handleSearch = () => {
    const token = localStorage.getItem('token');
    if(token){
    let decoded;
      try {
        decoded = jwtDecode(token);
      } catch (err) {
        console.error(`Invalid token: ${err}`);
        localStorage.removeItem('token');
      }
    
      axios
        .get(`${baseURL}/api/auth/${decoded.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then(res => setUser(res.data))
        .catch(err => {
          console.error('Failed to fetch user:', err);
          localStorage.removeItem('token');
        });
      }
    setFilters({
      collegeId: selectedInstitute?.value || null,
      departmentId: selectedDepartment?.value || null,
      researchInterests: researchInterest.trim(),
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

      <TextInput
        label="Research Interest"
        placeholder="e.g. cybersecurity"
        value={researchInterest}
        onChange={(e) => setResearchInterest(e.currentTarget.value)}
        mt="md"
      />

      <Button onClick={handleSearch} mt="md">
        Search Professors
      </Button>

      {showTable && (
        <ProfTable
          collegeId={filters.collegeId}
          departmentId={filters.departmentId}
          researchInterests={filters.researchInterests}
          user={user}
        />
      )}
    </div>
  );
}
