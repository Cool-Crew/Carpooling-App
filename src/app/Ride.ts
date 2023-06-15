export class Rider {
    riderID: string = "";
    pickupLocation: string = "";
}

class Message {
    msgID: string = '';
    content: string = '';
    userID: string = '';
}

enum Status {Not_Started, In_Progress, Complete, Cancelled}

export class Ride {
    _id: string = "";
    driverStartLocation: string = '';
    riders: Rider[] = [];
    dropoffLocation: string = '';
    dateTime: Date = new Date();
    chat: Message[] = [];
    status: Status = Status.Not_Started;
}

export class NewRide {
    rider: Rider = new Rider();
    dropoffLocation: string = '';
    dateTime: Date = new Date();
    status: Status = Status.Not_Started;
}