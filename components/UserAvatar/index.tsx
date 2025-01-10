import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { Logo } from '@/assets/images';

export default function UserAvatar() {
  const handlePress = () => {
    router.push('/profile');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Logo width={32} height={32} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  
    alignItems: 'center'
  }
}); 