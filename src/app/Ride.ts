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

export class StopLocation {
  address: string = "";
  location: { lat: number; lng: number; } | undefined;
  name: string = "";
}

export class Ride {
  _id: string = "";
  driver: string = "";
  driverStartLocation: StopLocation | undefined;
  riders: Rider[] = [];
  dropoffLocation: StopLocation | undefined;
  dateTime: Date | undefined;
  chat: Message[] = [];
  status: Status = Status.Not_Started;
}