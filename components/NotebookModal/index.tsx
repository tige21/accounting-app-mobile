import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import Colors from '@/constants/Colors'
import CommonInput from '@/components/CommonInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

interface NotebookModalProps {
  onSave: (note: { title: string; content: string }) => void
  onDismiss: () => void
  initialNote?: { title: string; content: string }
}

const NotebookModal = ({ onSave, onDismiss, initialNote }: NotebookModalProps) => {
  const [title, setTitle] = useState(initialNote?.title || '')
  const [content, setContent] = useState(initialNote?.content || '')

  const handleSave = () => {
    if (!title.trim()) return
    
    onSave({
      title: title.trim(),
      content: content.trim()
    })

    setTitle('')
    setContent('')
  }

  return (
    <BottomSheetView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onDismiss}>
          <Text style={styles.cancelButton}>Отменить</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.doneButton}>Готово</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        style={styles.content}
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={Platform.OS === 'ios' ? 100 : 80}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        enableResetScrollToCoords={false}
        scrollEnabled={true}
        keyboardOpeningTime={0}
        nestedScrollEnabled={true}
      >
      <CommonInput
        placeholder="Название"
        value={title}
        onChangeText={setTitle}
        style={styles.titleInput}
        isModal
      />

      <CommonInput
        placeholder="Текст заметки"
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
        style={styles.contentInput}
        isModal
        blurOnSubmit={false}
      />
      </KeyboardAwareScrollView>
    </BottomSheetView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cancelButton: {
    fontSize: 17,
    color: Colors.grey_2,
  },
  doneButton: {
    fontSize: 17,
    color: Colors.blue,
    fontWeight: '600',
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 17,
    minHeight: 200,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
})

export default NotebookModal 