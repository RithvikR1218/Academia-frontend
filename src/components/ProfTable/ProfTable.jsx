import { useEffect, useState } from 'react';
import { Table, Loader, Pagination, Button } from '@mantine/core';
import { getProfessors, insertBatchEntry } from '../../api/proff_search';
import { notifications } from '@mantine/notifications';
import './ProfTable.css';

export default function ProfTable({ collegeId, departmentId, researchInterests}) {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 10;
  useEffect(() => {
    console.log('👀 Props received:', { collegeId, departmentId, researchInterests});
    // rest of code...
  }, [collegeId, departmentId, researchInterests]);  

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

  const downloadCSV = async () => {
  const allProfessors = [];
  let currentPage = 1;
  let totalPages = 1; // Will update after first fetch
  const pageSize = 50; // Fetch 50 per request to avoid overloading backend

  try {
    while (currentPage <= totalPages) {
      const data = await getProfessors({
        collegeId,
        departmentId,
        researchInterests,
        page: currentPage,
        per_page: pageSize
      });

      allProfessors.push(...data.professors);

      if (currentPage === 1) {
        totalPages = Math.ceil(data.total / pageSize);
      }

      currentPage++;
    }

    // Build CSV
    const headers = ['Name', 'Email', 'College', 'Department', 'Position', 'Research Interests'];
    const rows = allProfessors.map((prof) => [
      prof.name,
      prof.email,
      prof.collegeId?.name || 'N/A',
      prof.departmentId?.name || 'N/A',
      prof.position,
    //   (prof.researchInterests || []).join(', ')
      (prof.researchInterests || [])
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'all_professors.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("❌ Failed to download full CSV:", error);
  }
};
  const saveInUserProfTable = async () => {
    const token = localStorage.getItem('token');
    if(!token){
    notifications.show({
        title: 'Error!',
        message: 'Please log in to save.',
        color: 'red',
      });
    window.location.href = '/login';
    return;
  }
    try{
    const allProfessors = [];
  let currentPage = 1;
  let totalPages = 1; // Will update after first fetch
  const pageSize = 50; // Fetch 50 per request to avoid overloading backend
    while (currentPage <= totalPages) {
      const data = await getProfessors({
        collegeId,
        departmentId,
        researchInterests,
        page: currentPage,
        per_page: pageSize
      });
      const ids=data.professors.map(prof => prof._id);
      allProfessors.push(...ids);

      if (currentPage === 1) {
        totalPages = Math.ceil(data.total / pageSize);
      }

      currentPage++;
    }
    await insertBatchEntry(allProfessors);
    notifications.show({
        title: 'Success!',
        message: 'Saved in Dashboard successfully',
        color: 'green',
      });
  }
  catch(error){
    console.error("Failed to save professors:", error);
  }
};

  if (loading) return <Loader />;

  const rows = professors.map((prof) => (
    <tr key={prof._id}>
        <td data-label="Name">{prof.name}</td>
        <td data-label="Email">{prof.email}</td>
        <td data-label="College">{prof.collegeId?.name || 'N/A'}</td>
        <td data-label="Department">{prof.departmentId?.name || 'N/A'}</td>
        <td data-label="Position">{prof.position}</td>
        <td data-label="Research Interests" className='research-td'>{prof.researchInterests?.join(', ')}</td>
    </tr>
  ));


  return (
    <>  
        <div className="table-div">
            <table className='prof-table table-container'>
                <thead>
                <tr>
                    <th>Name<i class="fa-solid fa-sort"></i></th>
                    <th>Email<i class="fa-solid fa-sort"></i></th>
                    <th>College<i class="fa-solid fa-sort"></i></th>
                    <th>Department<i class="fa-solid fa-sort"></i></th>
                    <th>Position<i class="fa-solid fa-sort"></i></th>
                    <th>Research Interests<i class="fa-solid fa-sort"></i></th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </div>

        <div className="table-bottom">
            <Button onClick={downloadCSV} className="csv-btn" disabled={professors.length <= 0} mb="md">
                <i class="fa-solid fa-download"></i>
                <div>Download Results as CSV</div>
            </Button>

            <Pagination
                value={page}
                onChange={setPage}
                total={Math.ceil(total / perPage)}
                siblings={0}
                className='page-btn'
                mt="m"
            />

            <Button onClick={saveInUserProfTable} className='save-btn' disabled={professors.length <= 0} mb="md">
                <i class="fa-solid fa-bookmark"></i>
                <div>Save Professors to Dashboard</div>
            </Button>
        </div>
    </>
  );
}