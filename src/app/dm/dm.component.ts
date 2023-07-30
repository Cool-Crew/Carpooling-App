import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../services/message/message.service';
import { Subscription, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './dm.component.html',
  styleUrls: ['./dm.component.css']
})
export class DmComponent implements OnInit, OnDestroy {
  TitleName: string = "Chat";
  iframeUrl!: SafeResourceUrl;
  messageList: any[] = [];
  userList: any[]=[];
  newMessage!: string;
  user: any;
  roomDetails: any;
  chatMood: string = "private"; // Set the chatMood to "private" by default
  receiver!: any;
  privateRoom!: any;
  isLoadingMessage: string = '';
  isMessageContainer: boolean = false;

  @ViewChild('messageContainer') messageContainer!: ElementRef;


  constructor(
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private _messageService: MessageService
  ) {
    this.user = this.authService.readToken();
    console.log("user info", this.user)
    this.updateIframeUrl();
  }

  ngOnInit() {
    this._messageService.getMessage();

    this.route.queryParams.subscribe(params => {
    });
    this._messageService.messages$.next(null);
    this._messageService.messages$.asObservable().subscribe((list) => {
      if (list) {
        this.messageList.push(list);
        this.scrollToBottom();
      }
    });

    this._messageService.getUsersList()
      .then((res) => {
        this.userList = res._users;
        console.log("user list ", this.userList)
      })
      .catch((err) => console.log(err));
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    // console.log(this.messageContainer)
    if (this.messageContainer != undefined) {
      const messageContainer = this.messageContainer?.nativeElement;
      messageContainer.scrollTop = messageContainer?.scrollHeight;
    }
  }

  ngOnDestroy() {
    this._messageService.removeUserSocket();
  }

  updateIframeUrl() {
    // const url = `https://deadsimplechat.com/qfQOGFiE8?username=${this.username}`;
    // this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  sendMessage() {
    const message = this.newMessage;
    const senderName = this.user.username;
    const senderId = this.user._id;
    let receiverId = this.receiver._id;
    let roomId = this.privateRoom?._id;

    if (this.newMessage != '') {
      this._messageService.sendMessagePrivate({ message, senderId, senderName, receiverId, roomId });
    }
    this.newMessage = "";
  }

  switchUser(chatRoom: any) {
    this.isMessageContainer = true;
    console.log("chat Room ", chatRoom)
    this.chatMood = "private";
    this._messageService.createPrivateRooms(this.user._id);
    this.getPrivateChatHistory(this.user._id, chatRoom._id);
    this.TitleName = chatRoom.username;
    this.receiver = chatRoom;

  }

  // createRoomById(userId: string) {
  //   this._messageService.createRoomById(userId)
  //     .then((res) => {
  //       this.roomDetails = res?._room;
  //       this.getHistoryRoom(this.roomDetails?._id);
  //     })
  //     .catch(err => console.log(err));
  // }

  getHistoryRoom(roomId: string) {
    this.isLoadingMessage = "Chat Loading ........";
    this.messageList = [];
    this._messageService.getRoomHistory(roomId)
      .then((res) => {
        this.messageList = res?._messages;
        if (this.messageList.length == 0) {
          this.isLoadingMessage = "Get Started Chat";
        }
      })
      .catch((err) => { console.log("error"); });
  }

  getPrivateChatHistory(senderId: string, receiverId: string) {
    this._messageService.getRoomDetails(senderId, receiverId)
      .then((res) => {
        if (res?._room) {
          this.getHistoryRoom(res?._room?._id);
          this.privateRoom = res?._room;
        }
      })
      .catch((err) => console.log(err));
  }

  getRoomList() {
    this._messageService.getRoomList()
      .then((res) => console.log("room list", res))
      .catch((err) => console.log(err));
  }
}
