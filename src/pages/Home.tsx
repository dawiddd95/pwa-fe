import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendLead } from '../api';

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendLead(name, email);
    navigate('/thank-you');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Wersja 4</h1>
      <h1>Zapisz się</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder='Imię' />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' type='email' />
      <button type='submit'>Wyślij</button>
    </form>
  );
}
