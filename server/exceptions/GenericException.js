/**
 * Exception class tailored to express' default error handler.
 */
class Exception extends Error {
    constructor({message, status}) {
        super(message);
        this.message = message;
        this.status = status;
    }
}

module.exports = Exception;