import React, { useRef, useState, memo, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  FlatList
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import Colors from '@/constants/Colors'
import BackButton from '@/components/BackButton'
import { router } from 'expo-router'
import NotebookModal from '@/components/NotebookModal'
import { Note } from '@/types/note'
import Feather from '@expo/vector-icons/Feather'
import { useNoteStore } from '@/store/noteStore'
import { FlashList } from '@shopify/flash-list'

// Мемоизированный компонент заметки
const NoteItem = memo(({ 
  note, 
  onPress 
}: { 
  note: Note
  onPress: (note: Note) => void
}) => (
  <TouchableOpacity 
    style={styles.noteItem} 
    onPress={() => onPress(note)}
  >
    <View style={styles.noteContent}>
      <Text 
        style={styles.noteTitle}
        numberOfLines={1}
      >
        {note.title}
      </Text>
      <Text 
        style={styles.notePreview}
        numberOfLines={2}
      >
        {note.content}
      </Text>
    </View>
    <Feather name="chevron-right" size={24} color={Colors.grey_2} />
  </TouchableOpacity>
))

// Мемоизированный компонент пустого состояния
const EmptyState = memo(() => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyStateText}>
      У вас пока нет заметок
    </Text>
  </View>
))

export default function NotesScreen() {
  const notes = useNoteStore(state => state.notes)
  const notebookModalRef = useRef<BottomSheetModal>(null)

  const handleBack = () => {
    router.back()
  }

  const handleAddNote = () => {
    notebookModalRef.current?.present()
  }

  const handleSaveNote = (noteData: { title: string; content: string }) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteData.title,
      content: noteData.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    useNoteStore.getState().addNote(newNote)
    notebookModalRef.current?.dismiss()
  }

  const handleToggleNote = (noteId: string) => {
    useNoteStore.getState().toggleNote(noteId)
  }

  const handleNotePress = useCallback((note: Note) => {
    router.push({
      pathname: '/note-details',
      params: {
        id: note.id,
        title: note.title,
        content: note.content
      }
    })
  }, [])

  const renderItem = useCallback(({ item }: { item: Note }) => (
    <NoteItem note={item} onPress={handleNotePress} />
  ), [handleNotePress])

  const keyExtractor = useCallback((item: Note) => item.id, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton handleBack={handleBack} />
        <Text style={styles.title}>Заметки</Text>
      </View>

      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        // estimatedItemSize={100}
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddNote}
      >
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>

      <BottomSheetModal
        ref={notebookModalRef}
        snapPoints={['90%']}
        enablePanDownToClose
      >
        <NotebookModal
          onSave={handleSaveNote}
          onDismiss={() => notebookModalRef.current?.dismiss()}
        />
      </BottomSheetModal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.black,
    marginLeft: 12,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.grey_2,
    fontWeight: '500',
  },
  noteItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteContent: {
    flex: 1,
    marginRight: 12,
  },
  noteTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 4,
  },
  notePreview: {
    fontSize: 15,
    color: Colors.grey_2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.grey_2,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listContent: {
    padding: 20,
  },
}) 