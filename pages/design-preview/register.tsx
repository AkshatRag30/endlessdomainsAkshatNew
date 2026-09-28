import AuthPreviewPage from '@/marketplace-preview/stubs/AuthPreviewPage'

/**
 * Temporary preview of the redesigned sign up page (same layout as login),
 * design only: see AuthPreviewPage. Not linked from anywhere else.
 */
export default function RegisterPreview() {
  return <AuthPreviewPage mode="signup" />
}
