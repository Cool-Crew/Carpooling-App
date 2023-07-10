export enum Category {
  Ride = "Ride",
  Account_Update = "Account_Update",
  General = "General",
}

export default class User {
  _id: string = "";
  email: string = "";
  password: string = "";
  username: string = "";
  firstName: string = "";
  lastName: string = "";
  phone: string = "";
  classes: string[] = [];
  interests: string[] = [];
  notifications: {
    msg: string;
    dateTime: Date | undefined;
    category: Category;
  }[] = [];
}
