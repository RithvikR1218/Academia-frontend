import {
    Table,
    TextInput,
    Button,
    Group,
    Loader,
    Text,
    ScrollArea,
    Box,
    Divider,
  } from '@mantine/core';
  import { IconTrash, IconEdit, IconCheck, IconX, IconPlus } from '@tabler/icons-react';
  import { useEffect, useState, useCallback } from 'react';
  import {
    getSynonyms,
    deleteSynonym,
    createSynonym,
    updateSynonym,
  } from '../../api/synonyms';
  import { notifications } from '@mantine/notifications';
  import './Admin.css';
  
  export default function SynonymAdminPanel() {
    const [synonyms, setSynonyms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [edited, setEdited] = useState({});
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [newSynonym, setNewSynonym] = useState({ name: '', synonyms: '' });
  
    const loadData = useCallback(async () => {
      setLoading(true);
      try {
        const data = await getSynonyms();
        setSynonyms(data);
      } catch (err) {
        console.error('❌ Failed to fetch:', err);
      } finally {
        setLoading(false);
      }
    }, []);
  
    useEffect(() => {
      loadData();
    }, [loadData]);
  
    const handleEdit = (syn) => {
      setEditingId(syn._id);
      setEdited({ ...syn });
    };
  
    const handleCancel = () => {
      setEditingId(null);
      setEdited({});
    };
  
    const handleChange = (field, value) => {
      setEdited((prev) => ({ ...prev, [field]: value }));
    };
  
    const handleDelete = async (id) => {
      try {
        await deleteSynonym(id);
        notifications.show({ message: 'Synonym deleted', color: 'green' });
        loadData();
      } catch (err) {
        console.error('❌ Delete failed:', err);
        notifications.show({ message: 'Delete failed', color: 'red' });
      }
    };
  
    const handleCreate = async () => {
      setCreating(true);
      try {
        const payload = {
          name: newSynonym.name.trim(),
          synonyms: newSynonym.synonyms
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        };
  
        if (!payload.name || payload.synonyms.length < 2) {
          notifications.show({
            message: 'Please enter a name and at least two synonyms',
            color: 'red',
          });
          return;
        }
  
        await createSynonym(payload);
        notifications.show({ message: 'Synonym group created', color: 'green' });
        setNewSynonym({ name: '', synonyms: '' });
        loadData();
      } catch (err) {
        console.error('❌ Creation failed:', err);
        notifications.show({ message: 'Creation failed', color: 'red' });
      } finally {
        setCreating(false);
      }
    };
  
    const handleUpdate = async () => {
      setUpdating(true);
      try {
        const payload = {
          name: edited.name.trim(),
          synonyms: edited.synonyms
            .map((s) => s.trim())
            .filter(Boolean),
          active: edited.active ?? true,
        };
  
        if (!payload.name || payload.synonyms.length < 2) {
          notifications.show({
            message: 'Please enter a name and at least two synonyms',
            color: 'red',
          });
          return;
        }
  
        await updateSynonym(edited._id, payload);
        notifications.show({ message: 'Synonym updated', color: 'green' });
        setEditingId(null);
        setEdited({});
        loadData();
      } catch (err) {
        console.error('❌ Update failed:', err);
        notifications.show({ message: 'Update failed', color: 'red' });
      } finally {
        setUpdating(false);
      }
    };
  
    return (
      <ScrollArea className='syn-full'>
        <Box mb="md">
          <div className='syn-search'>
            <TextInput
              placeholder="Unique Group Name"
              value={newSynonym.name}
              onChange={(e) => setNewSynonym({ ...newSynonym, name: e.target.value })}
            />
            <TextInput
              placeholder="Synonyms with Commas"
              value={newSynonym.synonyms}
              onChange={(e) => setNewSynonym({ ...newSynonym, synonyms: e.target.value })}
            />
            <Button
              leftSection={creating ? <Loader size="xs" /> : <IconPlus size={14} />}
              onClick={handleCreate}
              disabled={creating}
            >
              Add
            </Button>
          </div>
        </Box>
  
        {loading ? (
          <Loader mt="md" />
        ) : (
          <div className="table-div">
          <table className='syn-table table-container'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Synonyms</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {synonyms.map((syn) => (
                <tr key={syn._id}>
                  <td data-label='Name'>
                    {editingId === syn._id ? (
                      <TextInput
                        value={edited.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                      />
                    ) : (
                      syn.name
                    )}
                  </td>
                  <td data-label='Synonyms'>
                    {editingId === syn._id ? (
                      <TextInput
                        value={edited.synonyms.join(', ')}
                        onChange={(e) =>
                          handleChange(
                            'synonyms',
                            e.target.value.split(',').map((s) => s.trim())
                          )
                        }
                      />
                    ) : (
                      syn.synonyms.join(', ')
                    )}
                  </td>
                  <td data-label='Active'>{syn.active ? 'Yes' : 'No'}</td>
                  <td data-label='Actions'>
                    {editingId === syn._id ? (
                      <Group>
                        <Button
                          size="xs"
                          leftSection={<IconCheck size={14} />}
                          onClick={handleUpdate}
                          disabled={updating}
                        >
                          {updating ? 'Saving...' : 'Save'}
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
                          leftSection={<IconEdit size={14} />}
                          onClick={() => handleEdit(syn)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          color="red"
                          leftSection={<IconTrash size={14} />}
                          onClick={() => handleDelete(syn._id)}
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
        )}
      </ScrollArea>
    );
  }
  