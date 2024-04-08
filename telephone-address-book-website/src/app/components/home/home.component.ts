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

    // this.form.patchValue({
    //   'phone': country.dialCode,
    // });
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

  onSubmit(name: HTMLInputElement, phone: HTMLInputElement, address: HTMLInputElement, email: HTMLInputElement) {
    if (!this.form.valid) {
      return;
    }

    if (this.form.value.name == '') { name.classList.add('wrong'); return; }
    if (this.form.value.phone == '') { phone.classList.add('wrong'); return; }
    if (this.form.value.address == '') { address.classList.add('wrong'); return; }
    if (this.form.value.email == '') { email.classList.add('wrong'); return; }

    let nameParts = this.form.value.name.split(' ');
    let fname = nameParts[0];
    let lname = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    let body = {
      phone: this.form.value.phone,
      first_name: fname,
      last_name: lname,
      household: this.form.value.address,
      email: this.form.value.email
    };

    try {
      this.bookApiService.postData(body).subscribe({
        next: (result: HttpResponse<any>) => {
          console.log(result.body);
          this.isLoaded = false;
        },
        error: (err: any) => { console.error(err); },
        complete: () => {
          name.classList.remove('wrong');
          phone.classList.remove('wrong');
          address.classList.remove('wrong');
          email.classList.remove('wrong');

          this.form.patchValue({ 'name': '', 'phone': '', 'address': '', 'email': '' });

          this.getBook();
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
}
