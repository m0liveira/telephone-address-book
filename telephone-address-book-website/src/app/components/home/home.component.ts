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
  isLoaded: boolean = false;
  isDisabled: boolean = true;
  isAdding: boolean = false;
  selectedCountry: string = 'hr';
  display: any = [];
  pages: any = [];
  pageIndex: number = 1;
  message: string = "some text here";

  constructor(public bookApiService: BookAPIService) { }

  getBook() {
    try {
      this.bookApiService.getBook().subscribe({
        next: (result: HttpResponse<any>) => { this.bookApiService.data = result.body; },
        error: (err: any) => { console.error(err); },
        complete: () => {
          this.pages = [];
          this.pageIndex = 1;
          this.display = [];

          for (let data of this.bookApiService.data.data) { if (this.display.length < 10) { this.display.push(data) } }

          for (let i = 0; i < Math.ceil(this.bookApiService.data.data.length / 10); i++) {
            this.pages.push({ page: i + 1, active: false });
          }

          this.pages[0].active = true;
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
  }

  isValidEmail(email: string) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(String(email).toLowerCase());
  }

  onSubmit(name: HTMLInputElement, phone: HTMLInputElement, address: HTMLInputElement, email: HTMLInputElement, notification: HTMLDivElement) {
    if (!this.form.valid) {
      return;
    }

    name.classList.remove('wrong');
    phone.classList.remove('wrong');
    address.classList.remove('wrong');
    email.classList.remove('wrong');

    if (this.form.value.name == '') { name.classList.add('wrong'); return; }
    if (this.form.value.phone == '') { phone.classList.add('wrong'); return; }
    if (this.form.value.address == '') { address.classList.add('wrong'); return; }
    if (!this.isValidEmail(email.value)) { email.classList.add('wrong'); return; }

    let nameParts = this.form.value.name.split(' ');
    let fname = nameParts[0];
    let lname = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    let body = {
      phone: this.form.value.phone.replace(/\s/g, ""),
      first_name: fname,
      last_name: lname,
      household: this.form.value.address,
      email: this.form.value.email
    };

    try {
      let success: boolean = false;

      this.bookApiService.postData(body).subscribe({
        next: (result: HttpResponse<any>) => {
          this.isLoaded = false;

          if (result.body.status === 201 || result.body.status === 200) {
            this.message = result.body.message;
            notification.classList.add("success");
            notification.classList.toggle("opacity");
            success = true;
          } else {
            this.message = 'This email or phone number already exists';
            notification.classList.toggle("opacity");
          }
        },
        error: (err: any) => { console.error(err); },
        complete: () => {
          if (success) {
            name.classList.remove('wrong');
            phone.classList.remove('wrong');
            address.classList.remove('wrong');
            email.classList.remove('wrong');

            this.form.patchValue({ 'name': '', 'phone': '', 'address': '', 'email': '' });

            this.getBook();

            this.isAdding = !this.isAdding;
          } else {
            this.isLoaded = true;
          }

          setTimeout(() => {
            notification.classList.toggle("opacity");
            setTimeout(() => {
              notification.classList.remove("success");
            }, 250);
          }, 3000);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  onUpdate(name: HTMLInputElement, phone: HTMLInputElement, address: HTMLInputElement, email: HTMLInputElement, number: number, notification: HTMLDivElement) {
    if (this.isDisabled) {
      name.disabled = false;
      phone.disabled = false;
      address.disabled = false;
      email.disabled = false;
      this.isDisabled = false;

      return;
    }

    if (name.value == '') { name.classList.add('wrong'); return; }
    if (phone.value == '') { phone.classList.add('wrong'); return; }
    if (address.value == '') { address.classList.add('wrong'); return; }
    if (!this.isValidEmail(email.value)) { email.classList.add('wrong'); return; }

    let nameParts = name.value.split(' ');
    let fname = nameParts[0];
    let lname = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    let body = {
      phone: phone.value.replace(/\s/g, ""),
      first_name: fname,
      last_name: lname,
      household: address.value,
      email: email.value
    };

    try {
      this.bookApiService.updateData(number, body).subscribe({
        next: (result: HttpResponse<any>) => {
          this.isLoaded = false;

          if (result.body.status === 201 || result.body.status === 200) {
            this.message = result.body.message;
            notification.classList.toggle("success");
            notification.classList.toggle("opacity");
          } else {
            this.message = 'This email or phone number already exists';
            notification.classList.toggle("opacity");
          }
        },
        error: (err: any) => { console.error(err); },
        complete: () => {
          name.classList.remove('wrong');
          phone.classList.remove('wrong');
          address.classList.remove('wrong');
          email.classList.remove('wrong');

          name.disabled = true;
          phone.disabled = true;
          address.disabled = true;
          email.disabled = true;
          this.isDisabled = true;

          this.getBook();

          setTimeout(() => {
            notification.classList.toggle("opacity");
            setTimeout(() => {
              notification.classList.toggle("success");
            }, 250);
          }, 3000);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  removeData(phone: number, notification: HTMLDivElement) {
    if (!window.confirm("Are u sure you want to DELETE this phone number?")) { return; }

    try {
      this.bookApiService.DeleteData(phone).subscribe({
        next: (result: HttpResponse<any>) => {
          this.message = result.body.message;
          notification.classList.toggle("success");
          notification.classList.toggle("opacity");

          this.isLoaded = false;
        },
        error: (err: any) => { console.error(err); },
        complete: () => {
          this.getBook();

          setTimeout(() => {
            notification.classList.toggle("opacity");
            setTimeout(() => {
              notification.classList.toggle("success");
            }, 250);
          }, 3000);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  downloadPDF(card: any) {
    let body = {
      filePath: 'C:/Users/mateu/Documents/book.pdf',
      data: [card]
    }

    try {
      this.bookApiService.generatePdf(body).subscribe({
        next: (result: HttpResponse<any>) => {
          console.log(result.body);
          alert(`message: ${result.body.message}, file path: ${result.body.filePath}`);
        },
        error: (err: any) => { console.error(err); }, complete: () => { }
      });
    } catch (error) {
      console.error(error);
    }
  }

  downloadAll() {
    let body = {
      filePath: 'C:/Users/mateu/Documents/book.pdf',
      data: this.bookApiService.data.data
    }

    try {
      this.bookApiService.generatePdf(body).subscribe({
        next: (result: HttpResponse<any>) => {
          console.log(result.body);
          alert(`message: ${result.body.message}, file path: ${result.body.filePath}`);
        },
        error: (err: any) => { console.error(err); }, complete: () => { }
      });
    } catch (error) {
      console.error(error);
    }
  }

  changePage(page: any) {
    this.pages[this.pageIndex - 1].active = false;
    this.pageIndex = page.page;
    page.active = true;

    this.display = [];

    switch (this.pageIndex) {
      case 1:
        for (let i = 0; i < this.bookApiService.data.data.length; i++) {
          if (this.display.length >= 10) { break; }

          this.display.push(this.bookApiService.data.data[i]);
        }
        break;

      default:
        for (let i = (this.pageIndex - 1) * 10; i < this.bookApiService.data.data.length; i++) {
          if (this.display.length >= 10) { break; }

          this.display.push(this.bookApiService.data.data[i]);
        }
        break;
    }

    document.documentElement.scrollTop = 85;
  }

  previous() {
    if (this.pageIndex === 1) { return; }

    this.pages[this.pageIndex - 1].active = false;
    this.pageIndex--;
    this.pages[this.pageIndex - 1].active = true;

    this.display = [];

    switch (this.pageIndex) {
      case 1:
        for (let i = 0; i < this.bookApiService.data.data.length; i++) {
          if (this.display.length >= 10) { break; }

          this.display.push(this.bookApiService.data.data[i]);
        }
        break;

      default:
        for (let i = (this.pageIndex - 1) * 10; i < this.bookApiService.data.data.length; i++) {
          if (this.display.length >= 10) { break; }

          this.display.push(this.bookApiService.data.data[i]);
        }
        break;
    }

    document.documentElement.scrollTop = 85;
  }

  next() {
    if (this.pageIndex === Math.ceil(this.bookApiService.data.data.length / 10)) { return; }

    this.pages[this.pageIndex - 1].active = false;
    this.pageIndex++;
    this.pages[this.pageIndex - 1].active = true;

    this.display = [];

    switch (this.pageIndex) {
      case 1:
        for (let i = 0; i < this.bookApiService.data.data.length; i++) {
          if (this.display.length >= 10) { break; }

          this.display.push(this.bookApiService.data.data[i]);
        }
        break;

      default:
        for (let i = (this.pageIndex - 1) * 10; i < this.bookApiService.data.data.length; i++) {
          if (this.display.length >= 10) { break; }

          this.display.push(this.bookApiService.data.data[i]);
        }
        break;
    }

    document.documentElement.scrollTop = 85;
  }

  sortByKey(arr: any, key: string) {
    return arr.sort((a: { [x: string]: number; first_name: any; last_name: any; }, b: { [x: string]: number; first_name: any; last_name: any; }) => {
      if (key === "Name") {
        let fullNameA = `${a.first_name} ${a.last_name}`;
        let fullNameB = `${b.first_name} ${b.last_name}`;

        if (fullNameA < fullNameB) { return -1; }

        if (fullNameA > fullNameB) { return 1; }

        return 0;
      } else {
        if (a[key] < b[key]) { return -1; }

        if (a[key] > b[key]) { return 1; }

        return 0;
      }
    });
  }

  order(element: HTMLParagraphElement) {
    this.display = [];
    this.pages = [];
    this.pageIndex = 1;

    for (let i = 0; i < Math.ceil(this.bookApiService.data.data.length / 10); i++) {
      this.pages.push({ page: i + 1, active: false });
    }

    this.pages[0].active = true;

    switch (element.innerText) {
      case 'Name':
        this.sortByKey(this.bookApiService.data.data, element.innerText);

        for (let data of this.bookApiService.data.data) { if (this.display.length < 10) { this.display.push(data) } }
        break;

      case 'Email':
        this.sortByKey(this.bookApiService.data.data, element.innerText.toLowerCase());

        for (let data of this.bookApiService.data.data) { if (this.display.length < 10) { this.display.push(data) } }
        break;

      case 'Telephone':
        this.sortByKey(this.bookApiService.data.data, 'phone');

        for (let data of this.bookApiService.data.data) { if (this.display.length < 10) { this.display.push(data) } }
        break;

      case 'Address':
        this.sortByKey(this.bookApiService.data.data, 'household');

        for (let data of this.bookApiService.data.data) { if (this.display.length < 10) { this.display.push(data) } }
        break;
    }

    document.documentElement.scrollTop = 85;
  }

  order2(element: HTMLParagraphElement) {
    this.bookApiService.searchDisplay = [];

    switch (element.innerText) {
      case 'Name':
        this.sortByKey(this.bookApiService.search, element.innerText);

        for (let data of this.bookApiService.search) { this.bookApiService.searchDisplay.push(data) }
        break;

      case 'Email':
        this.sortByKey(this.bookApiService.search, element.innerText.toLowerCase());

        for (let data of this.bookApiService.search) { this.bookApiService.searchDisplay.push(data) }
        break;

      case 'Telephone':
        this.sortByKey(this.bookApiService.search, 'phone');

        for (let data of this.bookApiService.search) { this.bookApiService.searchDisplay.push(data) }
        break;

      case 'Address':
        this.sortByKey(this.bookApiService.search, 'household');

        for (let data of this.bookApiService.search) { this.bookApiService.searchDisplay.push(data) }
        break;
    }

    document.documentElement.scrollTop = 85;
  }

  showAdd() {
    this.isAdding = !this.isAdding;
    document.documentElement.scrollTop = 0;
  }
}
