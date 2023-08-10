import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],  
})
export class HomeComponent {

  constructor() { }

  ngOnInit(): void {
    this.disableFooterLinks();
  }

  disableFooterLinks(): void {
    const footerLinks = document.querySelectorAll('.footer a');
    footerLinks.forEach(link => {
      link.addEventListener('click', (event: Event) => {
        event.preventDefault(); // Prevent default anchor link behavior
      });
    });
  }

}
