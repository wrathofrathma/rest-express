// We're going to have our own, slightly more descriptive exception class.
/**
 * Slightly more descriptive error handling.
 * - message: Descriptive error message 
 * - status: HTTP status code
 * - code: Error code
 * 
 */
class Exception extends Error {
    constructor({message, status, code}) {
        super(message);
        this.message = message;
        this.status = status;
        this.code = code;
    }
}

/* Internally defined error codes 
* - E_DUPLICATE_RESOURCE
* - E_NOT_PROCESSABLE
*/

module.exports = Exception;