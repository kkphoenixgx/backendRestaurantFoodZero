import bcyrpt from "bcrypt";

export default class PasswordService {
  
  public static async encryptPassword(password :string) :Promise<string> {
    let encryptedPassword = await bcyrpt.hash(password, 13);
    return encryptedPassword;
  }

  public static async comparePassword(passwordHash :string, password :string) :Promise<boolean> {
    let comparison = await bcyrpt.compare(password, passwordHash);
    
    return comparison;
  }

}