import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, AuthRequest } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

// OAuth Provider Configurations
const oauthConfigs = {
  google: {
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
    scopes: ['openid', 'profile', 'email'],
    authorizationEndpoint: 'https://accounts.google.com/oauth/authorize',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    userInfoEndpoint: 'https://www.googleapis.com/oauth2/v2/userinfo',
    additionalParameters: {},
  },
  github: {
    clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID || '',
    scopes: ['read:user', 'user:email'],
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    userInfoEndpoint: 'https://api.github.com/user',
    additionalParameters: {},
  },
};

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'github';
  accessToken: string;
  refreshToken?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

export const useOAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
  });

  // Google OAuth Request
  const [googleRequest, googleResponse, googlePromptAsync] = useAuthRequest(
    {
      clientId: oauthConfigs.google.clientId,
      scopes: oauthConfigs.google.scopes,
      redirectUri: makeRedirectUri({
        scheme: 'walletwatch',
        path: 'auth',
      }),
      responseType: 'code',
    },
    {
      authorizationEndpoint: oauthConfigs.google.authorizationEndpoint,
    }
  );

  // GitHub OAuth Request  
  const [githubRequest, githubResponse, githubPromptAsync] = useAuthRequest(
    {
      clientId: oauthConfigs.github.clientId,
      scopes: oauthConfigs.github.scopes,
      redirectUri: makeRedirectUri({
        scheme: 'walletwatch',
        path: 'auth',
      }),
      responseType: 'code',
    },
    {
      authorizationEndpoint: oauthConfigs.github.authorizationEndpoint,
    }
  );

  // Check for existing authentication on mount
  useEffect(() => {
    checkExistingAuth();
  }, []);

  // Handle Google OAuth Response
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      handleAuthSuccess(googleResponse, 'google');
    } else if (googleResponse?.type === 'error') {
      handleAuthError(googleResponse.error);
    }
  }, [googleResponse]);

  // Handle GitHub OAuth Response
  useEffect(() => {
    if (githubResponse?.type === 'success') {
      handleAuthSuccess(githubResponse, 'github');
    } else if (githubResponse?.type === 'error') {
      handleAuthError(githubResponse.error);
    }
  }, [githubResponse]);

  const checkExistingAuth = async () => {
    try {
      const storedAuth = await SecureStore.getItemAsync('oauth_user');
      if (storedAuth) {
        const user = JSON.parse(storedAuth);
        setAuthState({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Error checking existing auth:', error);
    }
  };

  const handleAuthSuccess = async (response: any, provider: 'google' | 'github') => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Exchange code for token
      const tokenResponse = await exchangeCodeForToken(response.params.code, provider);
      
      // Get user info
      const userInfo = await getUserInfo(tokenResponse.access_token, provider);
      
      // Create user object
      const user: AuthUser = {
        id: userInfo.id || userInfo.login, // GitHub uses 'login', Google uses 'id'
        email: userInfo.email,
        name: userInfo.name || userInfo.login,
        picture: userInfo.picture || userInfo.avatar_url,
        provider,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
      };

      // Store auth data securely
      await SecureStore.setItemAsync('oauth_user', JSON.stringify(user));
      
      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleAuthError = (error: any) => {
    console.error('OAuth error:', error);
    setAuthState(prev => ({
      ...prev,
      isLoading: false,
      error: typeof error === 'string' ? error : 'Authentication failed',
    }));
  };

  const exchangeCodeForToken = async (code: string, provider: 'google' | 'github') => {
    const config = oauthConfigs[provider];
    const response = await fetch(config.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: provider === 'google' 
          ? process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET || ''
          : process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET || '',
        code,
        redirect_uri: makeRedirectUri({
          scheme: 'walletwatch',
          path: 'auth',
        }),
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    return response.json();
  };

  const getUserInfo = async (accessToken: string, provider: 'google' | 'github') => {
    const config = oauthConfigs[provider];
    const response = await fetch(config.userInfoEndpoint, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`User info fetch failed: ${response.statusText}`);
    }

    return response.json();
  };

  const signInWithProvider = async (provider: 'google' | 'github') => {
    // Check network connectivity
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      Alert.alert(
        'No Internet Connection',
        'OAuth authentication requires an internet connection. Please check your network and try again.'
      );
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (provider === 'google') {
        await googlePromptAsync();
      } else if (provider === 'github') {
        await githubPromptAsync();
      }
    } catch (error) {
      handleAuthError('Failed to initiate authentication');
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('oauth_user');
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const refreshAuthToken = async () => {
    if (!authState.user?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const config = oauthConfigs[authState.user.provider];
    const response = await fetch(config.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: authState.user.provider === 'google'
          ? process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET || ''
          : process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET || '',
        refresh_token: authState.user.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const tokenData = await response.json();
    const updatedUser = {
      ...authState.user,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || authState.user.refreshToken,
    };

    await SecureStore.setItemAsync('oauth_user', JSON.stringify(updatedUser));
    setAuthState(prev => ({ ...prev, user: updatedUser }));

    return tokenData.access_token;
  };

  const linkProvider = async (provider: 'google' | 'github') => {
    // Implementation for linking additional OAuth providers
    // This would be used in the account linking interface
    await signInWithProvider(provider);
  };

  return {
    ...authState,
    signInWithGoogle: () => signInWithProvider('google'),
    signInWithGitHub: () => signInWithProvider('github'),
    signOut,
    refreshAuthToken,
    linkProvider,
    canRetry: !!authState.error,
  };
};