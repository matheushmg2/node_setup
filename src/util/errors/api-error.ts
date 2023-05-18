import httpStatusCode from 'http-status-codes';

export interface APIErrorInterface {
  message: string;
  code: number;
  codeAsString?: string;
  description?: string;
  documentation?: string;
}

export interface APIErrorResponse extends Omit<APIErrorInterface, 'codeAsString'> {
  error: string;
}

export default class ApiError {
  public static format(error: APIErrorInterface): APIErrorResponse {
    return {
      ...{
        message: error.message,
        code: error.code,
        error: error.codeAsString
          ? error.codeAsString
          : httpStatusCode.getStatusText(error.code),
      },
      ...(error.documentation && { documentation: error.documentation }),
      ...(error.description && { description: error.description }),
    };
  }
}
