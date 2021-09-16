import { ValidationError } from 'yup';

interface Errors {
    [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
    // eslint-disable-next-line prettier/prettier
    const validationErrors: Errors = { };

    err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
    });

    return validationErrors;
}
