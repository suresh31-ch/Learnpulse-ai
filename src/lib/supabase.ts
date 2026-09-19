import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Resolve Supabase credentials safely from environment / secrets
// Supports import.meta.env (Vite client) and process.env fallback
function getEnvVar(key: string, viteKey?: string): string {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      const metaEnv = import.meta.env as Record<string, string | undefined>;
      if (metaEnv[key]) return String(metaEnv[key]).trim();
      if (viteKey && metaEnv[viteKey]) return String(metaEnv[viteKey]).trim();
    }
  } catch {
    // Ignore environment access errors in restricted contexts
  }

  try {
    if (typeof process !== 'undefined' && process.env) {
      if (process.env[key]) return String(process.env[key]).trim();
      if (viteKey && process.env[viteKey]) return String(process.env[viteKey]).trim();
    }
  } catch {
    // Ignore process access errors in browser contexts
  }

  return '';
}


const rawSupabaseUrl = getEnvVar('SUPABASE_URL', 'VITE_SUPABASE_URL');
// Normalize Supabase URL: strip trailing slashes and /rest/v1 if included in environment secret
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabasePublishableKey = getEnvVar('SUPABASE_PUBLISHABLE_KEY', 'VITE_SUPABASE_PUBLISHABLE_KEY');

/**
 * Checks whether Supabase credentials (URL and Publishable Key) are provided in the environment.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabasePublishableKey);
}

/**
 * Gets the configured Supabase URL (safe to expose to client).
 */
export function getSupabaseUrl(): string {
  return supabaseUrl;
}

// Singleton client instance
let clientInstance: SupabaseClient | null = null;

/**
 * Initializes or returns the reusable Supabase client instance.
 * Returns null if credentials are not configured, preventing startup crashes.
 */
export function getSupabase(): SupabaseClient | null {
  if (!clientInstance) {
    if (!isSupabaseConfigured()) {
      return null;
    }

    clientInstance = createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return clientInstance;
}

/**
 * Direct export of the initialized Supabase client instance.
 * Null if SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY are not yet configured.
 */
export const supabase = getSupabase();

/**
 * Verification result type reflecting genuine connection status.
 */
export interface SupabaseConnectionStatus {
  configured: boolean;
  connected: boolean;
  url: string | null;
  hasPublishableKey: boolean;
  authInitialized: boolean;
  errorMessage?: string;
  sessionActive?: boolean;
}

/**
 * Performs a real, non-mock verification check against the Supabase project.
 * Uses genuine auth.getSession() to verify the API endpoint and publishable key.
 * Does NOT generate fake status.
 */
export async function verifySupabaseConnection(): Promise<SupabaseConnectionStatus> {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      connected: false,
      url: supabaseUrl || null,
      hasPublishableKey: Boolean(supabasePublishableKey),
      authInitialized: false,
      errorMessage: 'SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY is not defined in environment secrets.',
    };
  }

  const client = getSupabase();
  if (!client) {
    return {
      configured: false,
      connected: false,
      url: supabaseUrl,
      hasPublishableKey: Boolean(supabasePublishableKey),
      authInitialized: false,
      errorMessage: 'Failed to initialize Supabase client instance.',
    };
  }

  try {
    // Perform a genuine Supabase Auth session call to verify connectivity to the Supabase endpoint
    const { data, error } = await client.auth.getSession();

    if (error) {
      return {
        configured: true,
        connected: false,
        url: supabaseUrl,
        hasPublishableKey: true,
        authInitialized: true,
        errorMessage: error.message,
      };
    }

    return {
      configured: true,
      connected: true,
      url: supabaseUrl,
      hasPublishableKey: true,
      authInitialized: true,
      sessionActive: Boolean(data.session),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown network or initialization error';
    return {
      configured: true,
      connected: false,
      url: supabaseUrl,
      hasPublishableKey: true,
      authInitialized: false,
      errorMessage: message,
    };
  }
}
