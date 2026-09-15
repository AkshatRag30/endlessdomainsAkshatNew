/**
 * This project has no wallet/auth system wired up yet (no auth context, no
 * cookie/session service) — the copied marketplace preview components all
 * expect one, so this stub stands in for it. `authenticated` is permanently
 * `false`, matching a fresh, logged-out visitor, which is the only state this
 * preview can realistically show without a real auth backend behind it.
 * Swap this for the project's real auth hook once one exists.
 */
export function useAuth() {
  return {
    authenticated: false,
    logout: () => {},
  }
}

export const Cookie_Key = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const

export function deleteCookieAttribute(_key: string) {
  // no-op: there is no real session to clear in this preview
}

export async function logoutUserApi() {
  // no-op: there is no real backend session to sign out of in this preview
}
