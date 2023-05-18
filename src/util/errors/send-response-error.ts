import { Response } from "express";
import mongoose from "mongoose";
import ApiError, { APIErrorInterface } from "./api-error";
import { CUSTOM_VALIDATION } from "~src/models/user";

export class SendResponseError {
  public static sendCreateUpdateErrorResponse(
    res: Response,
    error: mongoose.Error.ValidationError | Error
  ) {
    /**
     * Estamos estanciando um tipo de Error -> nesse exeplo,
     * estamos estanciando um tipo do (error instanceof mongoose.Error.ValidationError)
     * estamos estanciando o mongoose.Error.ValidationError para dentro de uma variavel error
     */
    if (error instanceof mongoose.Error.ValidationError) {
      const clientError = this.handleClientErrors(error);

        res.status(clientError.code).send(ApiError.format({ code: clientError.code, message: clientError.error}));

    } else {
      console.error(error);
      res.status(500).send(ApiError.format({ code: 500, message: 'Something went wrong!' })); // Algo deu errado!
    }
  }

  private static handleClientErrors(
    error: mongoose.Error.ValidationError
  ): { code: number; error: string } {
    const duplicatedKindErrors = Object.values(error.errors).filter(
      (err) => err.name === 'ValidatorError' && err.kind === CUSTOM_VALIDATION.DUPLICATED
    );
    if (duplicatedKindErrors.length) {
      return { code: 409, error: error.message };
    }
    return { code: 422, error: error.message };
  }

  public static sendErrorResponse(res: Response, apiError: APIErrorInterface): Response {
    return res.status(apiError.code).send(ApiError.format(apiError));
  }
}