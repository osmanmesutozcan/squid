/**
 * Takes multiple class names and concats into single string.
 * @param {Array} classes Classes to concat to
 */
export function classname(classes: string[]): string {
  classes = classes.filter(cn => cn && cn !== "");

  return classes.join(" ");
}
