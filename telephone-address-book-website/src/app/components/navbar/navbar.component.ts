import { Component, OnInit } from '@angular/core';
import { BookAPIService } from 'src/app/services/book-api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private bookApiService: BookAPIService) { }

  ngOnInit(): void { }

  search(input: HTMLInputElement) {
    this.bookApiService.search = [];
    this.bookApiService.searchDisplay = [];

    if (input.value == '') {
      this.bookApiService.isSearch = false;
      return;
    }

    for (let data of this.bookApiService.data.data) {
      let name = `${data.first_name} ${data.last_name}`;

      if (name.toLowerCase().includes(input.value.toLowerCase())) { this.bookApiService.search.push(data) }
    }

    for (let data of this.bookApiService.search) { this.bookApiService.searchDisplay.push(data) }

    this.bookApiService.isSearch = true;

    document.documentElement.scrollTop = 85;
  }
}
