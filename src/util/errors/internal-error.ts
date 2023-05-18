export class InternalError extends Error {
  constructor(
    public message: string,
    protected code: number = 500,
    protected description?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/*
Boas práticas
Essa classe seria para:
Para remover/quando estora um tipo de error/ se o error é estorado, 
essa classe em si, não irá aparecer o error, essa classe não precisa aparecer, 
Jogaremos uma parte do erro fora, para que apareça, apenas/a partir de onde o erro foi chamado

-> para a parte do backend -> iremos receber todos os status 
-> mas enviaremos apenas o status 500
*/