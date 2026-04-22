import { supabase } from './supabase'

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  })
  if (error) console.error('Error signing in with Google:', error.message)
}

export const signInWithApple = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: window.location.origin
    }
  })
  if (error) console.error('Error signing in with Apple:', error.message)
}

export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export const signUpWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin
  })
  if (error) throw error
}

export const updatePassword = async (newPassword) => {
  let retries = 3;
  let lastError = null;
  while (retries > 0) {
    try {
      // Increase delay to 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      if (error) {
        lastError = error;
        if (error.message && error.message.includes('lock')) {
          console.warn(`Lock error, retrying... (${retries} attempts left)`);
          retries--;
          continue;
        }
        throw error;
      }
      return; // Success
    } catch (err) {
      lastError = err;
      if (err.message && err.message.includes('lock') && retries > 0) {
        console.warn(`Lock error in catch, retrying... (${retries} attempts left)`);
        retries--;
        continue;
      }
      throw err;
    }
  }
  if (lastError) throw lastError;
}

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
