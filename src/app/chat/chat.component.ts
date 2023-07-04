import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  username: string;
  iframeUrl!: SafeResourceUrl;

  constructor(
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {
    this.username = 'default-username'; // Set initial username value
    this.updateIframeUrl();
  }

  ngOnInit() {
    const user = this.authService.readToken();
    if (user) {
      this.username = user.username;
      this.updateIframeUrl();
    }
  }

  updateIframeUrl() {
    const url = `https://deadsimplechat.com/qfQOGFiE8?username=${this.username}`;
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
