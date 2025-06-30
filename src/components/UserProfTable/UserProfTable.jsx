import { useEffect, useState } from 'react';
import { Table, Loader, Button, Checkbox, Group, Text } from '@mantine/core';
import { getUserProfEntries, deleteUserProfEntry, updateUserProfEntry, getAllProfessorsByIds } from '../../api/proff_search'; 
import './UserProfTable.css';
import { notifications } from '@mantine/notifications';

export default function UserProfTable({ userId }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getUserProfEntries();
      const professorIds = data.map(entry => entry.professorId);
      const professors = await getAllProfessorsByIds(professorIds);
      const profMap = new Map(
  professors.map(({ _id, ...rest }) => [_id, rest])
);
      const enrichedEntries = data.map(entry => ({
        ...entry,
        professor: profMap.get(entry.professorId),
      }));
      setEntries(enrichedEntries);
      //setEntries(data);
    } catch (error) {
      console.error("❌ Error fetching user prof entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const handleDelete = async (entryId) => {
    try {
      await deleteUserProfEntry(entryId);
      notifications.show({
              title: 'Removed!',
              message: 'Deleted successfully',
              color: 'orange',
            });
      setEntries((prev) => prev.filter((e) => e._id !== entryId));
      console.log("🗑️ Deleted entry:", entryId);
    } catch (error) {
      console.error("❌ Delete failed:", error);
    }
  };

  const handleCheckboxChange = async (entry, field) => {
  try {
    const updatedValue = !entry[field]; // compute the new value
    const updatedEntry = {
      ...entry,
      [field]: updatedValue,
    };
    setEntries((prev) =>
      prev.map((entry1) =>
        entry1._id === entry._id ? updatedEntry : entry1
      )
    );

    await updateUserProfEntry(entry._id, {
      contacted: updatedEntry.contacted,
      responded: updatedEntry.responded,
    });

    console.log("✅ Updated entry:", entry);
  } catch (error) {
    console.error("❌ Update failed:", error);
  }
};


  if (loading) return <Loader />;

  const rows = entries.map((entry) => (
  <tr key={entry._id}>
    <td>{entry.professor?.name || '—'}</td>
    <td>{entry.professor?.email || '—'}</td>
    <td>
      {entry.professor?.personal_website ? (
        <a href={entry.professor.personal_website} target="_blank" rel="noopener noreferrer">
          Website
        </a>
      ) : (
        '—'
      )}
    </td>
    <td>
  {entry.professor?.collegeId?.name ? (
    entry.professor?.college_website ? (
      <a
        href={entry.professor.college_website}
        target="_blank"
        rel="noopener noreferrer"
        id="college-link"
      >
        {entry.professor.collegeId.name}
      </a>
    ) : (
      entry.professor.collegeId.name
    )
  ) : (
    '—'
  )}
</td>
    <td>{entry.professor?.position || '—'}</td>
    <td>
      <Checkbox
        checked={entry.contacted}
        onChange={() => handleCheckboxChange(entry, 'contacted')}
      />
    </td>
    <td>
      <Checkbox
        checked={entry.responded}
        onChange={() => handleCheckboxChange(entry, 'responded')}
      />
    </td>
    <td>
      <Group spacing="xs">
        <Button size="xs" color="red" onClick={() => handleDelete(entry._id)}>
          Delete
        </Button>
      </Group>
    </td>
  </tr>
));

if (!entries || entries.length === 0) {
  return <Text className="no-professors-text">No professors selected.</Text>;
}

return (
  <div className="table-box">
  <Table striped highlightOnHover withTableBorder withColumnBorders className="my-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Website</th>
      <th>College</th>
      <th>Position</th>
      <th>Contacted</th>
      <th>Responded</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {entries.map((entry) => (
      <tr key={entry._id}>
        <td data-label="Name">{entry.professor?.name || '—'}</td>
        <td data-label="Email">{entry.professor?.email || '—'}</td>
        <td data-label="Website">
          {entry.professor?.personal_website ? (
            <a
              href={entry.professor.personal_website}
              target="_blank"
              rel="noopener noreferrer"
              className="my-link"
            >
              Website
            </a>
          ) : (
            '—'
          )}
        </td>
        <td>
        {entry.professor?.collegeId?.name ? (
        entry.professor?.college_website ? (
        <a
              href={entry.professor.college_website}
              target="_blank"
              rel="noopener noreferrer"
              id="college-link"
        >
        {entry.professor.collegeId.name}
      </a>
    ) : (
      entry.professor.collegeId.name
    )
  ) : (
    '—'
  )}
</td>

        <td data-label="Position">{entry.professor?.position || '—'}</td>
        <td data-label="Contacted">
          <Checkbox
            className="checkbox-cell"
            checked={entry.contacted}
            onChange={() => handleCheckboxChange(entry, 'contacted')}
          />
        </td>
        <td data-label="Responded">
          <Checkbox
            className="checkbox-cell"
            checked={entry.responded}
            onChange={() => handleCheckboxChange(entry, 'responded')}
          />
        </td>
        <td data-label="Actions" className="action-cell">
          <button
            className="my-delete-button"
            onClick={() => handleDelete(entry._id)}
          >
          <i className="fas fa-trash-alt"></i>
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>
</div>
);
}
