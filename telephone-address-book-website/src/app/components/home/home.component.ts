import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import intlTelInput from 'intl-tel-input';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('phoneInput', { static: true }) phoneInput!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    const input = this.phoneInput.nativeElement;
    if (input) {
      intlTelInput(input, {
        initialCountry: 'hr',
        nationalMode: true,
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js'
      });
    }
  }
}
