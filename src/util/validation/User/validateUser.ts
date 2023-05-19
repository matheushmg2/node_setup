export const validateEmail = (email: string) => {
  const regex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-z](-*\.?[a-z])*\.[a-z](-?[a-z])+$/;
  return regex.test(email);
};

export const validateSizeText = (text: any, num: number) => {
  if (text.length < num) {
    return false;
  }
  return true;
};

export const validatePasswordSizeAndCaracter = (password: string, obs?: boolean) => {
  if(obs) {
    if(password.replace(/[^a-zA-Z]/g,'').length < 5) {
      return false;
    }
  }
  const regex = /^(?=.*[@!#$%&*()/\\])[@!#$%&*()/\\a-zA-Z0-9]{8,20}$/;
  return regex.test(password);
};
