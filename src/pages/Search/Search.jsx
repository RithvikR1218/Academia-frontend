import { useState, useEffect } from 'react';
import { Button, TextInput } from '@mantine/core';
import College from '../../components/College';
import Department from '../../components/Department';
import ProfTable from '../../components/ProfTable/ProfTable';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
const baseURL = import.meta.env.VITE_BACKEND_URL;
import "./Search.css"

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
    setFilters({
      collegeId: selectedInstitute?.value || null,
      departmentId: selectedDepartment?.value || null,
      researchInterests: researchInterest.trim(),
    });
    setShowTable(true);
  };

  const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
          handleSearch();
      }
  };

  return (
    <div className="search-container">
        <div className="gradient-blob-1"></div>
        <div className="gradient-blob-2"></div>
        <div className="gradient-blob-3"></div>
        <div className="gradient-blob-4"></div>
        <div className="gradient-blob-5"></div>
        <p className="search-p">Fuzzy Search for Professors</p>
        <h1 className="search-h1">Search Tool</h1>
        <div className="search-flex">
            <College
                value={selectedInstitute?.value || null}
                className="search-college"
                onChange={(option) => {
                setSelectedInstitute(option);
                setSelectedDepartment(null);
                }}
            />

            <Department
                value={selectedInstitute?.value}
                className="search-dept"
                onChange={(option) => setSelectedDepartment(option)}
            />

            <TextInput
                placeholder="Research Interest (e.g. AIML)"
                value={researchInterest}
                className="search-interest"
                onChange={(e) => setResearchInterest(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleKeyDown(e);
                  }
                }}
                mt="md"
            />

            <Button className="search-btn" onClick={handleSearch} mt="md">
                <i class="fa-solid fa-magnifying-glass"></i>
                Search
            </Button>
        </div>

      {showTable && (
        <ProfTable
          collegeId={filters.collegeId}
          departmentId={filters.departmentId}
          researchInterests={filters.researchInterests}
        />
      )}
    </div>
  );
}
