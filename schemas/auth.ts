import * as z from 'zod';

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required!')
      .max(50, 'First name must be at most 50 characters!')
      .refine(
        (firstName) => /^[a-zA-Z\s'-]+$/.test(firstName),
        'First name contains invalid characters!'
      ),
    lastName: z
      .string()
      .min(1, 'Last name is required!')
      .max(50, 'Last name must be at most 50 characters!')
      .refine(
        (lastName) => /^[a-zA-Z\s'-]+$/.test(lastName),
        'Last name contains invalid characters!'
      ),
    email: z.email('Please enter a valid email address!'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters!')
      .max(20, 'Password must be at most 20 characters!')
      .refine(
        (password) => /[A-Z]/.test(password),
        'Password must contain at least one uppercase letter!'
      )
      .refine(
        (password) => /[a-z]/.test(password),
        'Password must contain at least one lowercase letter!'
      )
      .refine((password) => /[0-9]/.test(password), 'Password must contain at least one number!')
      .refine(
        (password) => /[!@#$%^&*]/.test(password),
        'Password must contain at least one special character!'
      ),
    passwordConfirm: z.string().min(8, 'Please confirm your password!'),
  })
  .refine((data) => data.password == data.passwordConfirm, {
    error: 'Passwords do not match!',
    path: ['passwordConfirm'],
  });

export const signinSchema = z.object({
  email: z.email('Please enter a valid email address!'),
  password: z.string().min(1, 'Password is required!'),
});

export const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address!'),
});

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters!')
    .max(20, 'Password must be at most 20 characters!')
    .refine(
      (password) => /[A-Z]/.test(password),
      'Password must contain at least one uppercase letter!'
    )
    .refine(
      (password) => /[a-z]/.test(password),
      'Password must contain at least one lowercase letter!'
    )
    .refine((password) => /[0-9]/.test(password), 'Password must contain at least one number!')
    .refine(
      (password) => /[!@#$%^&*]/.test(password),
      'Password must contain at least one special character!'
    ),
  code: z.string().min(1, 'Verification code is required!'),
});
