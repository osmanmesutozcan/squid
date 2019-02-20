/**
 * Takes multiple class names and concats into single string.
 * @param {Array} classes Classes to concat to
 */
export function classname(classes) {
  classes = classes.filter(cn => cn && cn !== "");

  return classes.join(" ");
}
