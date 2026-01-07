import { auth } from '@/FirebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  type UserCredential,
} from 'firebase/auth';

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

/**
 * Sign up a new user with email and password
 */
export async function signUp(data: SignUpData): Promise<AuthResult> {
  try {
    const user = await createUserWithEmailAndPassword(auth, data.email, data.password);
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

/**
 * Sign in an existing user with email and password
 */
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

/**
 * Send a password reset email to the user
 */
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

/**
 * Reset password with verification code
 */
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
