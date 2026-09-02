export function truncateMiddle(value: string, maxLength = 20): string {
  if (value.length <= maxLength) return value

  const headLength = Math.ceil((maxLength - 3) / 2)
  const tailLength = Math.floor((maxLength - 3) / 2)

  return `${value.slice(0, headLength)}...${value.slice(value.length - tailLength)}`
}
