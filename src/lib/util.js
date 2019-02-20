/**
 * Generate a random uuid.
 * returns {String} random string
 */
function uuid() {
  return (Math.random() * 100).toString();
}

export default { uuid };
