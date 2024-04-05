import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  navList: any = [{ text: 'Home', url: '/Home' }, { text: 'Add', url: '/Add' }, { text: 'Delete', url: '/Delete' }];

  constructor() { }

  ngOnInit(): void { }
}
