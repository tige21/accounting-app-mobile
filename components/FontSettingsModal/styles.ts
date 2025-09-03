import { StyleSheet, Dimensions } from 'react-native';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 34,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: Colors.black,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 12,
  },
  
  // Font Size Section
  sliderContainer: {
    paddingHorizontal: 4,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  fontSizeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  fontSizeLabel: {
    fontSize: 12,
    color: Colors.grey_2,
  },
  fontSizeCurrentValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.blue,
  },
  
  // Options Container (Font Family & Style)
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    minWidth: (width - 56) / 2 - 6, // Responsive width for 2 columns with gaps
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: Colors.blue_2,
    borderColor: Colors.blue,
  },
  optionButtonText: {
    fontSize: 14,
    color: Colors.black,
    textAlign: 'center',
  },
  optionButtonTextSelected: {
    color: Colors.blue,
    fontWeight: '600',
  },
  
  // Preview Section
  previewContainer: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    minHeight: 80,
    justifyContent: 'center',
  },
  previewText: {
    color: Colors.black,
    lineHeight: 24,
    textAlign: 'left',
  },
  
  // Buttons
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    marginTop: 20,
  },
  buttonWrapper: {
    flex: 1,
  },
});