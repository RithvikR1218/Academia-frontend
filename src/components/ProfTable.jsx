import { useEffect, useState } from 'react';
import { Table, Loader, Pagination, Button } from '@mantine/core';
import { getProfessors } from '../api/proff_search';

export default function ProfTable({ collegeId, departmentId, researchInterests }) {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    setLoading(true);
    getProfessors({ collegeId, departmentId, researchInterests, page, per_page: perPage })
      .then((data) => {
        setProfessors(data.professors);
        setTotal(data.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [collegeId, departmentId, researchInterests, page]);

  const downloadCSV = () => {
    const headers = ['Name', 'Email', 'College', 'Department', 'Position', 'Research Interests'];
    const rows = professors.map((prof) => [
      prof.name,
      prof.email,
      prof.collegeId?.name || 'N/A',
      prof.departmentId?.name || 'N/A',
      prof.position,
      (prof.researchInterests || []).join(', ')
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'professors_page.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <>
      {professors.length > 0 && (
        <Button onClick={downloadCSV} mb="md">
          Download Current Page as CSV
        </Button>
      )}

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

      <Pagination
        value={page}
        onChange={setPage}
        total={Math.ceil(total / perPage)}
        mt="md"
      />
    </>
  );
}