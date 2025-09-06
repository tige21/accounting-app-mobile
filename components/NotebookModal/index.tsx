import React, { useState, forwardRef, useMemo, memo } from 'react'
import { TouchableOpacity, Platform } from 'react-native'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Feather } from '@expo/vector-icons'
import ThemedView from '@/components/ThemedView'
import ThemedText from '@/components/ThemedText'
import CommonInput from '@/components/CommonInput'
import BackdropComponent from '@/components/BackdropComponent'
import { useDynamicStyles, useThemeColor } from '@/hooks'

interface NotebookModalProps {
  onSave: (note: { title: string; content: string }) => void
  onDismiss: () => void
  initialNote?: { title: string; content: string }
}

const NotebookModal = memo(
  forwardRef<BottomSheetModal, NotebookModalProps>(
    ({ onSave, onDismiss, initialNote }, ref) => {
      const [title, setTitle] = useState(initialNote?.title || '')
      const [content, setContent] = useState(initialNote?.content || '')

      // Theme colors
      const primaryColor = useThemeColor({}, 'primary')

      // Dynamic styles
      const styles = useDynamicStyles(createStyles)

      // Snap points
      const snapPoints = useMemo(() => ['80%'], [])

      const handleSave = () => {
        if (!title.trim()) return
        
        onSave({
          title: title.trim(),
          content: content.trim()
        })

        setTitle('')
        setContent('')
        onDismiss()
      }

      return (
        <BottomSheetModal
          ref={ref}
          snapPoints={snapPoints}
          backdropComponent={BackdropComponent}
          enablePanDownToClose
          onDismiss={onDismiss}
          accessibilityLabel="Notebook modal"
          backgroundStyle={[
            bottomSheetModalStyles.bottomSheetModal,
            { backgroundColor: styles.container.backgroundColor }
          ]}
        >
          <BottomSheetView style={styles.container}>
            {/* Header */}
            <ThemedView colorName="surface" style={styles.header}>
              <ThemedView colorName="surface" style={styles.headerContent}>
                <Feather 
                  name="edit-3" 
                  size={24} 
                  color={primaryColor} 
                  style={styles.headerIcon}
                />
                <ThemedText type="heading" style={styles.title}>
                  {initialNote ? 'Редактировать заметку' : 'Новая заметка'}
                </ThemedText>
              </ThemedView>
              <TouchableOpacity 
                onPress={handleSave}
                style={styles.doneButton}
                accessibilityRole="button"
                accessibilityLabel="Сохранить заметку"
              >
                <ThemedText style={styles.doneButtonText}>Готово</ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {/* Divider */}
            <ThemedView colorName="surface" style={styles.divider} />

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
              <ThemedView colorName="surface" style={styles.inputContainer}>
                <CommonInput
                  placeholder="Название заметки"
                  value={title}
                  onChangeText={setTitle}
                  style={styles.titleInput}
                  isModal
                  accessibilityLabel="Название заметки"
                />
              </ThemedView>

              <ThemedView colorName="surface" style={styles.inputContainer}>
                <CommonInput
                  placeholder="Текст заметки"
                  value={content}
                  onChangeText={setContent}
                  multiline
                  textAlignVertical="top"
                  style={styles.contentInput}
                  isModal
                  accessibilityLabel="Содержание заметки"
                />
              </ThemedView>
            </KeyboardAwareScrollView>
          </BottomSheetView>
        </BottomSheetModal>
      )
    }
  )
)

const createStyles = (colors: any) => ({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
    paddingHorizontal: 4,
    backgroundColor: colors.surface,
  },
  headerContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
    backgroundColor: colors.surface,
  },
  headerIcon: {
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    flex: 1,
  },
  doneButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  doneButtonText: {
    fontSize: 17,
    color: colors.primary,
    fontWeight: '600' as const,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
    marginVertical: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  inputContainer: {
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  contentInput: {
    fontSize: 17,
    minHeight: 200,
    color: colors.textPrimary,
  },
})

const bottomSheetModalStyles = {
  bottomSheetModal: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
}

NotebookModal.displayName = 'NotebookModal'

export default NotebookModal