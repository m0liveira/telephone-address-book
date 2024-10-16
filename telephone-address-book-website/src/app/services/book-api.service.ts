import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookAPIService {
  host: string = 'http://localhost:5043';
  url: string = `${this.host}/book`;
  generatePDFUrl: string = `${this.host}/book/pdf`;

  data!: any;
  search: Array<any> = [];
  searchDisplay: Array<any> = [];
  isSearch: boolean = false;


  constructor(private http: HttpClient) { }

  generatePdf(form: object) { return this.http.post(this.generatePDFUrl, form, { observe: 'response' }); }

  postData(form: object) { return this.http.post(this.url, form, { observe: 'response' }); }

  getBook() { return this.http.get<any[]>(this.url, { observe: 'response' }); }

  getData(phone: number) { return this.http.get<any[]>(`${this.url}/${phone}`, { observe: 'response' }); }

  updateData(phone: number, form: any) { return this.http.put<any[]>(`${this.url}/${phone}`, form, { observe: 'response' }); }

  DeleteData(phone: number) { return this.http.delete<any[]>(`${this.url}/${phone}`, { observe: 'response' }); }
}
