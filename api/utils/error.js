// Custom error handler function
export const errorHandler = (statusCode, message) => {
    // Create a new error instance
    const error = new Error();
    
    // Assign the provided status code to the error object
    error.statusCode = statusCode;
    
    // Assign the provided message to the error object
    error.message = message;
    
    // Return the customized error object
    return error;
};