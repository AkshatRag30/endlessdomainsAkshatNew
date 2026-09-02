// Static asset filenames on disk sometimes carry an uppercase extension (e.g. camera-export .JPG).
// Next.js's built-in image module declarations only match the lowercase glob, so this covers the rest.
declare module '*.JPG' {
  const content: import('next/dist/shared/lib/image-external').StaticImageData

  export default content
}
