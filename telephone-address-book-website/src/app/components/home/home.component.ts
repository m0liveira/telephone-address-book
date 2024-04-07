import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { BookAPIService } from '../../services/book-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  form!: FormGroup;
  editForm!: FormGroup;
  isLoaded: boolean = false;
  isDisabled: boolean = true
  selectedCountry: string = 'hr';

  constructor(public bookApiService: BookAPIService) { }

  countryChange(country: any) {
    let countryCodes = { dial: country.dialCode, country: country.iso2 };

    console.log(countryCodes);
  }

  getBook() {
    try {
      this.bookApiService.getBook().subscribe({
        next: (result: HttpResponse<any>) => {
          this.bookApiService.data = result.body;
        },
        error: (err: any) => { console.error(err); },
        complete: () => {
          this.isLoaded = true;
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  ngOnInit(): void {
    this.getBook();

    this.form = new FormGroup({
      'name': new FormControl(''),
      'phone': new FormControl(''),
      'address': new FormControl(''),
      'email': new FormControl('')
    });

    this.editForm = new FormGroup({
      'name': new FormControl(''),
      'phone': new FormControl(''),
      'address': new FormControl(''),
      'email': new FormControl('')
    });
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
