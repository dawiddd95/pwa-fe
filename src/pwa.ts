// Importujemy bazę danych IndexedDB
import { db } from './db';
// Importujemy axios do wysyłki danych na backend
import axios from 'axios';

let isSyncing = false;

// Główna funkcja do synchronizacji lokalnych leadów z backendem
export async function syncLeads() {
  if (isSyncing) return; // zapobiegamy duplikatom
  isSyncing = true;

  // Pobieramy wszystkie leady oznaczone jako niesynchronizowane
  const unsynced = await db.leads.where('synced').equals(0).toArray();

  for (const lead of unsynced) {
    try {
      await db.leads.update(lead.id!, { synced: -1 });

      // Wysyłamy dane leada do backendu
      await axios.post('https://b66e-85-237-177-211.ngrok-free.app/api/leads', {
        name: lead.name,
        email: lead.email
      });

      await db.leads.update(lead.id!, { synced: 1 });
    } catch (err) {
      await db.leads.update(lead.id!, { synced: 0 });
      console.warn('❌ Sync fail:', lead.name, err);
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