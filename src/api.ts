// Importujemy axios do zapytań HTTP
import axios from 'axios';
// Importujemy bazę danych i typ rekordu
import { db, Lead } from './db';

// Główna funkcja do wysyłania danych leada
export async function sendLead(name: string, email: string) {
  try {
    // Próbujemy wysłać lead na backend (gdy jesteśmy online)
    await axios.post('https://b66e-85-237-177-211.ngrok-free.app/api/leads', { name, email });
  } catch (error) {
    // Jeśli nie mamy internetu lub API nie działa – zapisujemy lokalnie
    console.warn('Offline lub backend niedostępny. Zapisuję lokalnie.');

    await db.leads.add({
      name,
      email,
      synced: -1 // -1 = w trakcie synchronizowania
    } as Lead);
  }
}
