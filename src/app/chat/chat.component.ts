import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../services/message/message.service';
import { Subscription, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  TitleName: string = "Ride Group Chat";
  iframeUrl!: SafeResourceUrl;
  messageList: any[] = [];
  userList!: any[];
  newMessage!: string;
  user: any;
  rideId!: string;
  roomDetails: any;
  chatMood: string = "group";
  receiver!: any;
  rideDetails: any;
  privateRoom!: any;
  isLoadingMessage: string = '';


  @ViewChild('messageContainer') messageContainer!: ElementRef;

  constructor(
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private _messageService: MessageService
  ) {

    this.user = this.authService.readToken();
    // console.log(this.user)
    this.updateIframeUrl();
  }

  ngOnInit() {

    this._messageService.getMessage();

    this.route.queryParams.subscribe(params => {
      const encodedRide = params['ride'];
      const decodedRide = JSON.parse(decodeURIComponent(encodedRide))
      this.rideDetails = decodedRide;
      this.rideId = params?.['id'];
      this.TitleName = this.rideDetails.dropoffLocation;
    });
    this._messageService.messages$.next(null);
    this._messageService.messages$.asObservable().subscribe((list) => {
      if (list) {
        this.messageList.push(list);
        this.scrollToBottom();
      }
    })

    this._messageService.getUsersList()
      .then((res) => {
        this.userList = res._users;
      })
      .catch((err) => console.log(err))
    this.createRoomByApi(this.user._id, this.rideId);
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  private scrollToBottom(): void {
    const messageContainer = this.messageContainer.nativeElement;
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
  ngOnDestroy() {

    this._messageService.leaveRoom(this.roomDetails._id);
    this._messageService.removeUserSocket();
  }
  updateIframeUrl() {
    // const url = `https://deadsimplechat.com/qfQOGFiE8?username=${this.username}`;
    // this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  sendMessage() {
    const rideId = this.rideId;
    const message = this.newMessage;
    const senderName = this.user.username;
    const senderId = this.user._id;
    const roomId = this.roomDetails?._id;
    if (this.chatMood == "group" && this.newMessage != '') {
      this._messageService.createRoom(roomId);
      this._messageService.SendMessage({ rideId, message, senderName, senderId, roomId })
    } else if (this.newMessage != '') {
      let receiverId = this.receiver._id;
      let roomId = this.privateRoom?._id;
      this._messageService.sendMessagePrivate({ message, senderId, senderName, receiverId, roomId })
    }
    this.newMessage = "";
  }

  switchUser(chatRoom: any, type?: string) {
    this._messageService.leaveRoom(this.roomDetails._id);
    if (type == "group") {
      this.roomDetails = chatRoom;
      this.getHistoryRoom(chatRoom._id);
      this._messageService.createRoom(chatRoom._id);
      this.chatMood = "group";
      this.TitleName = this.rideDetails.dropoffLocation;
    } else {
      this.chatMood = "private";
      this._messageService.createPrivateRooms(this.user._id);
      this.getPrivateChatHistory(this.user._id, chatRoom._id);
      this.TitleName = chatRoom.username;
      this.receiver = chatRoom;
    }
  }

  createRoomByApi(userId: string, rideId: string) {
    this._messageService.createRoomByApi(rideId, userId,).then((res) => {
      this.roomDetails = res?._room;
      console.log("api ", res)
      this.getHistoryRoom(this.roomDetails?._id);
    }).catch(err => console.log(err))
  }

  getHistoryRoom(roomId: string) {
    this.isLoadingMessage = "Chat Loading ........";
    this.messageList = [];
    this._messageService.getRoomHistory(roomId)
      .then((res) => {
        this.messageList = res?._messages;
        if (this.messageList.length == 0) {
          this.isLoadingMessage = "Get Started Chat"
        }
        console.log('total api length ', this.messageList.length)
      })
      .catch((err) => { console.log("error") })
  }

  getPrivateChatHistory(senderId: string, receiverId: string) {
    console.log("sender id", senderId, "receiver id", receiverId)
    this._messageService.getRoomDetails(senderId, receiverId)
      .then((res) => {
        if (res?._room) {
          this.getHistoryRoom(res?._room?._id);
          this.privateRoom = res?._room;
        }

      }).catch((err) => console.log(err))
  }

  getRoomList() {
    this._messageService.getRoomList()
    .then((res) => console.log("room list", res))
    .catch((err) => console.log(err))
  }
}
