/**
 * Verifies the provided data is a string, otherwise throws provided error
 * @param data The string resolvable to resolve
 * @param error The Error constructor to instantiate [default: `Error`]
 * @param errorMessage The error message to throw with [default: "Expected string, got <data> instead."]
 * @param allowEmpty Whether an empty string should be allowed [default: true]
 */
export const verifyString: (
  data: unknown,
  error?: ErrorConstructor,
  errorMessage?: string,
  allowEmpty?: boolean
) => string = (
  data,
  error = Error,
  errorMessage = `Expected a string, got ${data} instead.`,
  allowEmpty = true
) => {
  if (typeof data !== 'string') throw new error(errorMessage)
  if (!allowEmpty && data.length === 0) throw new error(errorMessage)

  return data
}

export interface SplitOptions {
  /**
   * Maximum character length per message piece [default: 2000]
   */
  maxLength?: number

  /**
   * Character(s) or Regex(es) to split the message with,
   * an array can be used to split multiple times [default: '\n']
   */
  char?: string | string[] | RegExp | RegExp[]

  /**
   * Text to prepend to every piece except the first [default: ""]
   */
  prepend?: string

  /**
   * Text to append to every piece except the last [default: ""]
   */
  append?: string
}

// /**
//  * Splits a string into multiple chunks at a designated character that do not exceed a specific length.
//  * @param {string} text Content to split
//  * @param {SplitOptions} [options] Options controlling the behavior of the split
//  * @deprecated This will be removed in the next major version.
//  * @returns {string[]}
//  */
// function splitMessage(
//   text: string,
//   { maxLength = 2000, char = '\n', prepend = '', append = '' } = {}
// ) {
//   if (!deprecationEmittedForSplitMessage) {
//     process.emitWarning(
//       'The Util.splitMessage method is deprecated and will be removed in the next major version.',
//       'DeprecationWarning'
//     )

//     deprecationEmittedForSplitMessage = true
//   }

//   text = Util.verifyString(text)
//   if (text.length <= maxLength) return [text]
//   let splitText = [text]
//   if (Array.isArray(char)) {
//     while (
//       char.length > 0 &&
//       splitText.some(element => element.length > maxLength)
//     ) {
//       const currentChar = char.shift()
//       splitText =
//         currentChar instanceof RegExp
//           ? splitText.flatMap(chunk => chunk.match(currentChar))
//           : splitText.flatMap(chunk => chunk.split(currentChar))
//     }
//   } else {
//     splitText = text.split(char)
//   }

//   if (splitText.some(element => element.length > maxLength))
//     throw new RangeError('SPLIT_MAX_LEN')
//   const messages = []
//   let message = ''
//   for (const chunk of splitText) {
//     if (message && (message + char + chunk + append).length > maxLength) {
//       messages.push(message + append)
//       message = prepend
//     }

//     message += (message && message !== prepend ? char : '') + chunk
//   }

//   return messages.concat(message).filter(Boolean)
// }

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
