interface IValdate {
  name: string;
  password: string;
  email: string;
}

export class Validate {
  public static Email(email: string): boolean {
    const regex =
      /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-z](-*\.?[a-z])*\.[a-z](-?[a-z])+$/;
    return regex.test(email);
  }

  public static SizeText(text: string, num: number): boolean {
    const regex = /[^a-zA-Zãáéóõ ]/g;
    if (text.replace(regex, '').length < num) {
      return false;
    }
    
    if(text.match(regex)){
      return false;
    }
    return true;
  }

  public static PasswordSizeAndCaracter(
    password: string,
    obs?: boolean
  ): boolean {
    if (obs) {
      if (password.replace(/[^A-Z]/g, '').length < 1) {
        return false;
      }
      if (password.replace(/[^a-zA-Z]/g, '').length < 5) {
        return false;
      }
    }
    const regex = /^(?=.*[@!#$%&*_()/\\])[@!#$%&_*()/\\a-zA-Z0-9]{8,20}$/;
    return regex.test(password);
  }

  public static validation(conjunto: IValdate): any {
    let isValid: boolean = false;
    let message = {};

    if (!Validate.SizeText(conjunto.name, 5)) {
      isValid = true;
      message = 'Must contain at least 5 characters, letters only.';
    }
    if (!Validate.PasswordSizeAndCaracter(conjunto.password, true)) {
      isValid = true;
      message =
        'Must contain at least one special character and at least 8 characters.';
    }
    if (!Validate.Email(conjunto.email)) {
      isValid = true;
      message = 'Please, type a valid email';
    } 
    return { isValid, message };
  }
}
