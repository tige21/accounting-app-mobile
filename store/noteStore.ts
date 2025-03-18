import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Note } from '@/types/note'

interface NoteStore {
  notes: Note[]
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  getNoteById: (id: string) => Note | undefined
  clearNotes: () => void
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      notes: [],
      
      addNote: (note) => {
        set((state) => ({
          notes: [
            {
              ...note,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              todos: note.todos || [],
            },
            ...state.notes,
          ],
        }))
      },
      
      updateNote: (id, updates) => {
        set(state => ({
          notes: state.notes.map(note =>
            note.id === id
              ? { ...note, ...updates }
              : note
          )
        }))
      },
      
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }))
      },

      getNoteById: (id) => {
        return get().notes.find(note => note.id === id)
      },

      clearNotes: () => set({ notes: [] }),
    }),
    {
      name: 'notes-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
) 