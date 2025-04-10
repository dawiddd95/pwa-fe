// Importujemy bazę danych IndexedDB
import { db } from './db';
// Importujemy axios do wysyłki danych na backend
import axios from 'axios';

// Główna funkcja do synchronizacji lokalnych leadów z backendem
export async function syncLeads() {
  // Pobieramy wszystkie leady oznaczone jako niesynchronizowane
  const unsynced = await db.leads.where('synced').equals(0).toArray();

  // Iterujemy po nich i próbujemy je wysłać do backendu
  for (const lead of unsynced) {
    try {
      // Wysyłamy dane leada do backendu
      await axios.post('https://675d-85-237-177-211.ngrok-free.app/api/leads', {
        name: lead.name,
        email: lead.email
      });

      // Oznaczamy rekord jako zsynchronizowany (synced = 1)
      await db.leads.update(lead.id!, { synced: 1 });

    } catch (err) {
      // Jeśli nie działa – zostawiamy w bazie i kończymy próbę
      console.warn('Synchronizacja nie powiodła się, spróbuję później.');
    }
  }
}

// Automatyczne wywołanie synchronizacji po odzyskaniu internetu
window.addEventListener('online', () => {
  console.log('Jesteś online – rozpoczynam synchronizację...');
  syncLeads();
});

// ⏱️ Regularna synchronizacja co 30 sekund, jeśli jesteś online
setInterval(() => {
  if (navigator.onLine) {
    console.log('⏱️ Sprawdzam, czy są leady do synchronizacji...');
    syncLeads();
  }
}, 30000); // 30 sekund
