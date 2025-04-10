// Importujemy Dexie – bibliotekę ułatwiającą pracę z IndexedDB
import Dexie, { Table } from 'dexie';

// Definicja typu pojedynczego leada (rekordu)
export interface Lead {
  id?: number;         // Klucz główny (automatyczny ++id)
  name: string;        // Imię osoby zapisanej
  email: string;       // Adres e-mail
  synced: 0 | 1 | -1;       // 0 = lokalnie zapisane, 1 = zsynchronizowane z backendem, -1 = jest synchronizowany
}

// Tworzymy klasę bazy danych, rozszerzając Dexie
export class LeadDatabase extends Dexie {
  // Deklarujemy tabelę typu Lead
  leads!: Table<Lead, number>;

  constructor() {
    // Nazwa bazy danych w IndexedDB
    super('LeadAppDB');

    // Definiujemy schemat bazy: tabelę leads z indeksem po synced
    this.version(1).stores({
      leads: '++id,synced,name,email'
    });
  }
}

// Eksportujemy instancję bazy
export const db = new LeadDatabase();
