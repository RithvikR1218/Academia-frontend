import { useEffect, useState } from 'react';
import { Table, Loader, Button, Checkbox, Group, Text } from '@mantine/core';
import { getUserProfEntries, deleteUserProfEntry, updateUserProfEntry, getAllProfessorsByIds } from '../api/proff_search'; 

export default function UserProfTable({ userId }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getUserProfEntries(userId);
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

  const handleUpdate = async (entry) => {
    try {
      console.log(entry);
      await updateUserProfEntry(entry._id, {
        contacted: entry.contacted,
        responded: entry.responded,
      });
      console.log("✅ Updated entry:", entry._id);
    } catch (error) {
      console.error("❌ Update failed:", error);
    }
  };

  const handleDelete = async (entryId) => {
    try {
      await deleteUserProfEntry(entryId);
      setEntries((prev) => prev.filter((e) => e._id !== entryId));
      console.log("🗑️ Deleted entry:", entryId);
    } catch (error) {
      console.error("❌ Delete failed:", error);
    }
  };

  const handleCheckboxChange = (entryId, field) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry._id === entryId ? { ...entry, [field]: !entry[field] } : entry
      )
    );
    console.log(`Entry : ${entryId} was modified`);
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
    <td>{entry.professor?.position || '—'}</td>
    <td>
      <Checkbox
        checked={entry.contacted}
        onChange={() => handleCheckboxChange(entry._id, 'contacted')}
      />
    </td>
    <td>
      <Checkbox
        checked={entry.responded}
        onChange={() => handleCheckboxChange(entry._id, 'responded')}
      />
    </td>
    <td>
      <Group spacing="xs">
        <Button size="xs" onClick={() => handleUpdate(entry)}>
          Update
        </Button>
        <Button size="xs" color="red" onClick={() => handleDelete(entry._id)}>
          Delete
        </Button>
      </Group>
    </td>
  </tr>
));

if (!entries || entries.length === 0) {
  return <Text>No professors selected.</Text>;
}

return (
  <Table striped highlightOnHover withTableBorder withColumnBorders>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Website</th>
        <th>Position</th>
        <th>Contacted</th>
        <th>Responded</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>{rows}</tbody>
  </Table>
);
}
