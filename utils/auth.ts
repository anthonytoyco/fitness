import { auth, db } from '@/FirebaseConfig';
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  type UserCredential,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import * as React from 'react';

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  code: string;
  newPassword: string;
}

export interface AuthResult {
  success: boolean;
  user?: UserCredential;
  error?: string;
}

export async function signUp(data: SignUpData): Promise<AuthResult> {
  try {
    const user = await createUserWithEmailAndPassword(auth, data.email, data.password);

    await setDoc(doc(db, 'users', user.user.uid), {
      uid: user.user.uid,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      createdAt: new Date().toISOString(),
    });

    console.log('SUCCESS: User signed up:', user);
    return { success: true, user };
  } catch (error: any) {
    console.log('ERROR: ', error);
    return {
      success: false,
      error: error.message || 'An error occurred during sign up',
    };
  }
}

export async function signIn(data: SignInData): Promise<AuthResult> {
  try {
    const user = await signInWithEmailAndPassword(auth, data.email, data.password);
    console.log('SUCCESS: User signed in:', user);
    return { success: true, user };
  } catch (error: any) {
    console.log('ERROR: ', error);
    return {
      success: false,
      error: error.message || 'An error occurred during sign in',
    };
  }
}

export async function sendPasswordReset(data: ForgotPasswordData): Promise<AuthResult> {
  try {
    await sendPasswordResetEmail(auth, data.email);
    console.log('SUCCESS: Password reset email sent');
    return { success: true };
  } catch (error: any) {
    console.log('ERROR: ', error);
    return {
      success: false,
      error: error.message || 'An error occurred while sending password reset email',
    };
  }
}

export async function resetPassword(data: ResetPasswordData): Promise<AuthResult> {
  try {
    await confirmPasswordReset(auth, data.code, data.newPassword);
    console.log('SUCCESS: Password reset successfully');
    return { success: true };
  } catch (error: any) {
    console.log('ERROR: ', error);
    return {
      success: false,
      error: error.message || 'An error occurred while resetting password',
    };
  }
}
