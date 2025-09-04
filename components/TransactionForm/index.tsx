import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useTransactionStore } from '@/store/transactionStore';
import CommonInput from '@/components/CommonInput';
import ThemedText from '@/components/ThemedText';
import CommonButton from '@/components/CommonButton';
import CategoryButton from '@/components/CategoryButton';
import { ECatogories } from '@/constants/enums';
import { getCategoryColor } from '@/utils/categoryColors';
import { router } from 'expo-router';
import CalendarPickButton from '@/components/CalendarPickModal/CalendarPickButton';
import styles from './styles';

