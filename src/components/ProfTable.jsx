import { useEffect, useState } from 'react';
import { Table, Loader } from '@mantine/core';
import { getProfessors } from '../api/proff_search';

export default function ProfTable({ collegeId, departmentId }) {
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