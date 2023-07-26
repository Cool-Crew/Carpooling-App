export class Rider {
  riderID: string = "";
  pickupLocation: string = "";
}

export class Message {
  msgID: string = "";
  content: string = "";
  userID: string = "";
}

export class Feedback {
  riderId: string = "";
  rating: number = 0;
  feedback: string = "";
}

export enum Status {
  Not_Started = "Not_Started",
  In_Progress = "In_Progress",
  Complete = "Complete",
  Cancelled = "Cancelled",
}

export class StopLocation {
  address: string = "";
  location: { lat: number; lng: number } | undefined;
  name: string = "";
}

export class Ride {
  _id: string = "";
  driver: string = "";
  creator: string = "";
  driverStartLocation: StopLocation | undefined;
  riders: Rider[] = [];
  dropoffLocation: StopLocation | undefined;
  dateTime: Date | undefined;
  riderClasses: [] = [];
  riderInterests: [] = [];
  chat: Message[] = [];
  feedback: Feedback[] = [];
  status: Status = Status.Not_Started;
}

export class RiderLocationMapping {
  riderId: String | undefined;
  pickupLocation: String | undefined;
}
export class RideList {
  rideId: string = "";
  pickupLocation: String | undefined;
  dropoffLocation: String | undefined;
  dateTime: String | undefined;
  status: Status = Status.Not_Started;
  statusString: String | undefined;
  color: string | undefined;
  riders: RiderLocationMapping[] | undefined;
  driverName: string | undefined;
  rating: number | undefined;
  feedback: string | undefined;
  feedbackCategory: string | undefined;
  creator: string | undefined;
  driver: string | undefined;
}
