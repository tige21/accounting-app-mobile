import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';

export default function UserAvatar() {
  const handlePress = () => {
    router.push('/profile');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image 
        source={require('@/assets/images/logo.png')} 
        style={styles.avatar}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
}); 