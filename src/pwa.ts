// Importujemy bazę danych IndexedDB
import { db } from './db';
// Importujemy axios do wysyłki danych na backend
import axios from 'axios';

// Flaga lokalna chroniąca przed wielokrotnym sync
let isSyncing = false;

// Główna funkcja do synchronizacji lokalnych leadów z backendem
export async function syncLeads() {
  if (isSyncing) return;
  isSyncing = true;

  try {
    // Pobieramy tylko leady z synced: -1 lub 0 (niezsynchronizowane)
    const unsynced = await db.leads.where('synced').anyOf([0, -1]).toArray();

    // Iterujemy po nich i próbujemy je wysłać do backendu
    for (const lead of unsynced) {
      try {
        // Oznaczamy jako "w trakcie synchronizacji"
        await db.leads.update(lead.id!, { synced: -1 });

        // Wysyłamy dane leada do backendu
        await axios.post('https://0594-85-237-177-211.ngrok-free.app/api/leads', {
          name: lead.name,
          email: lead.email
        });

        // Oznaczamy rekord jako zsynchronizowany (synced = 1)
        await db.leads.update(lead.id!, { synced: 1 });
        console.log(`✅ Zsynchronizowano: ${lead.name}`);
      } catch (err) {
        // Jeśli nie działa – zostawiamy w bazie i kończymy próbę
        console.warn('Synchronizacja nie powiodła się, spróbuję później.');
        await db.leads.update(lead.id!, { synced: 0 });
      }
    } 
  } catch(err) {
    console.error('❌ Sync globalny się wywalił:', err);
  }

  isSyncing = false;
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
