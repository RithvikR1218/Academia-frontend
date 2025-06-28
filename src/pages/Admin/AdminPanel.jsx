import {
    Table,
    TextInput,
    Button,
    Pagination,
    Loader,
    Group,
    Textarea,
    Box,
  } from '@mantine/core';
  import { IconTrash, IconEdit, IconCheck, IconX } from '@tabler/icons-react';
  import { useEffect, useState, useCallback } from 'react';
  import {
    getProfessors,
    updateProfessor,
    deleteProfessor,
  } from '../../api/proff_search';
  import { notifications } from '@mantine/notifications';
  import College from '../../components/College';
  import Department from '../../components/Department';
  import './Admin.css';
  
  export default function AdminPanel() {
    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [edited, setEdited] = useState({});
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [collegeId, setCollegeId] = useState(null);
    const [departmentId, setDepartmentId] = useState(null);
  
    const perPage = 10;
  
    const loadData = useCallback(async () => {
      setLoading(true);
      try {
        const data = await getProfessors({
          page,
          per_page: perPage,
          collegeId,
          departmentId,
        });
        setProfessors(data.professors);
        setTotal(data.total);
      } catch (err) {
        console.error('❌ Failed to fetch:', err);
      } finally {
        setLoading(false);
      }
    }, [page, collegeId, departmentId]);
  
    useEffect(() => {
      loadData();
    }, [loadData]);
  
    const handleEdit = (prof) => {
      setEditingId(prof._id);
      setEdited({
        ...prof,
        collegeId: prof.collegeId?._id || '',
        departmentId: prof.departmentId?._id || '',
      });
    };
  
    const handleSave = async () => {
      try {
        await updateProfessor(edited._id, edited);
        setEditingId(null);
        await loadData();
        notifications.show({
          title: 'Updated!',
          message: 'Professor updated successfully',
          color: 'green',
        });
      } catch (err) {
        console.error('❌ Update failed:', err);
      }
    };
  
    const handleDelete = async (id) => {
      try {
        await deleteProfessor(id);
        await loadData();
        notifications.show({
          title: 'Deleted!',
          message: 'Professor removed successfully',
          color: 'red',
        });
      } catch (err) {
        console.error('❌ Delete failed:', err);
      }
    };
  
    const handleCancel = () => {
      setEditingId(null);
      setEdited({});
    };
  
    const handleChange = (field, value) => {
      setEdited((prev) => ({ ...prev, [field]: value }));
    };
  
    return (
    <Box>
    <div className="top-admin">
        <div mb="md" align="flex-end" className='admin-search'>
          <College value={collegeId} onChange={(opt) => {
            setCollegeId(opt?.value || null);
            setDepartmentId(null); // reset dept on college change
            setPage(1);
          }} />
          <Department value={collegeId} onChange={(opt) => {
            setDepartmentId(opt?.value || null);
            setPage(1);
          }} />
        </div>
    </div>
  
        {loading ? (
          <Loader />
        ) : (
          <>
          <div className="table-div">
                <table className='table-container'>
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>College</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Research Interests</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {professors.map((prof) => (
                    <tr key={prof._id}>
                        <td data-label="Name">
                        {editingId === prof._id ? (
                            <TextInput
                            value={edited.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            />
                        ) : (
                            prof.name
                        )}
                        </td>
                        <td data-label="Email">
                        {editingId === prof._id ? (
                            <TextInput
                            value={edited.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            />
                        ) : (
                            prof.email
                        )}
                        </td>
                        <td data-label="College">{prof.collegeId?.name || 'N/A'}</td>
                        <td data-label="Department">{prof.departmentId?.name || 'N/A'}</td>
                        <td data-label="Position">
                        {editingId === prof._id ? (
                            <TextInput
                            value={edited.position || ''}
                            onChange={(e) => handleChange('position', e.target.value)}
                            />
                        ) : (
                            prof.position || 'N/A'
                        )}
                        </td>
                        <td data-label="Research Interests">
                        {editingId === prof._id ? (
                            <Textarea
                            value={(edited.researchInterests || []).join(', ')}
                            onChange={(e) =>
                                handleChange(
                                'researchInterests',
                                e.target.value.split(',').map((s) => s.trim())
                                )
                            }
                            />
                        ) : (
                            (prof.researchInterests || []).join(', ')
                        )}
                        </td>
                        <td data-label="Actions">
                        {editingId === prof._id ? (
                            <Group>
                            <Button
                                size="xs"
                                onClick={handleSave}
                                leftSection={<IconCheck size={14} />}
                            >
                                Save
                            </Button>
                            <Button
                                size="xs"
                                color="gray"
                                onClick={handleCancel}
                                leftSection={<IconX size={14} />}
                                className='red-button'
                            >
                                Cancel
                            </Button>
                            </Group>
                        ) : (
                            <Group>
                            <Button
                                size="xs"
                                onClick={() => handleEdit(prof)}
                                leftSection={<IconEdit size={14} />}
                            >
                                Edit
                            </Button>
                            <Button
                                size="xs"
                                color="red"
                                onClick={() => handleDelete(prof._id)}
                                leftSection={<IconTrash size={14} />}
                                className='red-button'
                            >
                                Delete
                            </Button>
                            </Group>
                        )}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
  
            <div className="admin-pgn-div">
                <Pagination
                value={page}
                onChange={setPage}
                total={Math.ceil(total / perPage)}
                mt="md"
                className='admin-pgn'
                />
            </div>
          </>
        )}
      </Box>
    );
  }
  