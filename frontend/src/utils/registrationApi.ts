interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
}

export const apiWithRetry = async (
  url: string,
  options: RequestInit,
  retryOptions: RetryOptions = {}
): Promise<Response> => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000
  } = retryOptions;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        
        if (attempt < maxRetries) {
          console.log(`Rate limited. Retrying after ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }

      // Handle duplicate request processing
      if (response.status === 409) {
        const data = await response.json();
        if (data.code === 'DUPLICATE_REQUEST_PROCESSING') {
          if (attempt < maxRetries) {
            const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
            console.log(`Duplicate request detected. Retrying after ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
        throw new Error(data.error || 'Duplicate request');
      }

      // Handle server errors (5xx)
      if (response.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }

      return response;

    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt + 1} failed:`, error);

      if (attempt < maxRetries) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
};

export const submitRegistration = async (formData: Record<string, unknown>) => {
  try {
    const response = await apiWithRetry('/api/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    }, {
      maxRetries: 3,
      baseDelay: 2000,
      maxDelay: 10000
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }

    return await response.json();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Registration failed:', error);
    
    // Provide user-friendly error messages
    if (errorMessage.includes('Rate limited') || errorMessage.includes('429')) {
      throw new Error('Too many registration attempts. Please wait a moment and try again.');
    } else if (errorMessage.includes('Duplicate request')) {
      throw new Error('A similar registration is already being processed. Please check your email or try again later.');
    } else if (errorMessage.includes('Network')) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error(errorMessage || 'Registration failed. Please try again.');
    }
  }
};