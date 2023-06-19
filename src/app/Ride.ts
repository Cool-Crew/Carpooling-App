export class Rider {
  riderID: string = "";
  pickupLocation: string = "";
}

export class Message {
  msgID: string = "";
  content: string = "";
  userID: string = "";
}

export enum Status {
  Not_Started = "Not_Started",
  In_Progress = "In_Progress",
  Complete = "Complete",
  Cancelled = "Cancelled",
}

export class Ride {
  _id: string = "";
  driver: string = "";
  driverStartLocation: string = "";
  riders: Rider[] = [];
  dropoffLocation: string = "";
  dateTime: Date | undefined;
  chat: Message[] = [];
  status: Status = Status.Not_Started;
}
