/**
 * Creates a standardized API response.
 *
 * @param {boolean} success - Indicates if the request was successful.
 * @param {any} [data=null] - The response data if the request succeeds.
 * @param {Error|string|null} [error=null] - Error message or object (extracts `.message` if an Error object).
 * @returns {{ success: boolean, data: any, error: string|null }} The formatted response object.
 *
 */
export function createResponse(
  success,
  data = null,
  error = null,
  status = null
) {
  return { success, data, error: error?.message || error, status };
}




// Just an utility function to format the dates being displayed on the dashboard
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const year = date.getFullYear().toString().slice(-2); // last 2 digits of year
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

