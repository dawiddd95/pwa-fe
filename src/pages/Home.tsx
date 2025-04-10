import { useState } from 'react';
import { sendLead } from '../api';
import { db } from '../db'; // importujemy bazę IndexedDB

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendLead(name, email);
  };

  // 🔍 Przyciskiem wypisujemy całą lokalną bazę
  const showIndexedDB = async () => {
    const allLeads = await db.leads.toArray();
    console.log('📦 Zawartość IndexedDB:', allLeads);
    alert(`Znaleziono ${allLeads.length} leadów. Sprawdź konsolę!`);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>Zapisz się</h1>
        <input value={name} onChange={e => setName(e.target.value)} placeholder='Imię' />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' type='email' />
        <button type='submit'>Wyślij</button>
      </form>

      {/* 🔘 Przycisk do debugowania IndexedDB */}
      <button onClick={showIndexedDB}>🔍 Pokaż IndexedDB</button>
    </>
  );
}
