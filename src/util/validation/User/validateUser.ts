export class Validate {
  public static Email(email: string) {
    const regex =
      /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-z](-*\.?[a-z])*\.[a-z](-?[a-z])+$/;
    return regex.test(email);
  }

  public static SizeText(text: any, num: number) {
    if (text.length < num) {
      return false;
    }
    return true;
  }

  public static PasswordSizeAndCaracter(password: string,
    obs?: boolean) {
      if (obs) {
        if (password.replace(/[^a-zA-Z]/g, '').length < 5) {
          return false;
        }
      }
      const regex = /^(?=.*[@!#$%&*()/\\])[@!#$%&*()/\\a-zA-Z0-9]{8,20}$/;
      return regex.test(password);
  }
}