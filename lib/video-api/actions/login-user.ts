'use server'

import type { SignInResponse } from '@/lib/validation/auth-validation'

import { handleApiError } from '@/lib/error-handler'
import { signInResponseSchema } from '@/lib/validation/auth-validation'

export default async function signInWithCredentials(username: string, password: string): Promise<SignInResponse> {
  try {
    const res = await fetch(`${process.env.API_URL}/authentication/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
      const error = handleApiError(await res.json())
      return { message: error.message }
    }

    const validatedResponse = signInResponseSchema.parse(await res.json())
    return validatedResponse
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during sign in.'
    return {
      message: errorMessage,
    }
  }
}
