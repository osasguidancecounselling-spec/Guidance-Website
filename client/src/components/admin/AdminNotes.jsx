import React, { useState } from 'react';

const AdminNotes = () => {
  const [notes, setNotes] = useState([
    { id: 1, text: 'Review student submissions' },
    { id: 2, text: 'Prepare meeting agenda' },
  ]);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (newNote.trim() === '') return;
    const note = {
      id: notes.length + 1,
      text: newNote.trim(),
    };
    setNotes([...notes, note]);
    setNewNote('');
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div>
      <h2>Admin Notes</h2>
      <ul>
        {notes.map(note => (
          <li key={note.id}>
            {note.text}{' '}
            <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newNote}
        onChange={e => setNewNote(e.target.value)}
        placeholder="Add a new note"
      />
      <button onClick={handleAddNote}>Add Note</button>
    </div>
  );
};

export default AdminNotes;
