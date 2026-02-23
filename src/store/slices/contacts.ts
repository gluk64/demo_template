import { SEED_CONTACTS } from '@/lib/mock/seedData'
import type { StateCreator } from 'zustand'
import type { RootState } from '../index'
import type { Contact, ContactId } from '@/types'

export type ContactsSlice = {
  contacts: Contact[]
  addContact: (contact: Omit<Contact, 'id' | 'addedAt'>) => void
  updateContact: (id: ContactId, updates: Partial<Contact>) => void
}

export const createContactsSlice: StateCreator<
  RootState,
  [],
  [],
  ContactsSlice
> = (set) => ({
  contacts: SEED_CONTACTS,

  addContact: (contact) =>
    set((state) => ({
      contacts: [
        ...state.contacts,
        {
          ...contact,
          id: `contact-${Date.now()}` as ContactId,
          addedAt: Date.now(),
        },
      ],
    })),

  updateContact: (id, updates) =>
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id ? { ...c, ...updates } : c,
      ),
    })),
})
