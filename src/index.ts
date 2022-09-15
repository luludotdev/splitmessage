export interface SplitOptions {
  maxLength?: number
  char?: string | string[] | RegExp | RegExp[]
}

export const splitMessage: (
  text: string,
  options?: SplitOptions
) => string[] = (text, { maxLength = 2000, char = '\n' } = {}) => {
  if (text.length <= maxLength) return [text]
  let messages = [text]

  if (Array.isArray(char)) {
    while (
      char.length > 0 &&
      messages.some(element => element.length > maxLength)
    ) {
      const currentChar = char.shift()!
      const split =
        currentChar instanceof RegExp
          ? messages.flatMap(chunk => chunk.match(currentChar))
          : messages.flatMap(chunk => chunk.split(currentChar))

      messages = split.filter(
        (chunk): chunk is string => typeof chunk === 'string'
      )
    }
  } else {
    messages = text.split(char)
  }

  if (messages.some(element => element.length > maxLength)) {
    throw new RangeError('SPLIT_MAX_LEN')
  }

  return messages
}
