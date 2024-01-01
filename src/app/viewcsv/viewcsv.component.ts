import { Component } from '@angular/core';
import { Csv } from '../module/users';
import { UserService } from '../service/user.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-viewcsv',
  templateUrl: './viewcsv.component.html',
  styleUrls: ['./viewcsv.component.css']
})
export class ViewcsvComponent 
{
  isPaid: boolean = false;
  message: string='';
  apiUrl = 'http://localhost:8586/customerpage';
  togglePayment(row: any) 
  {
    row.isPaid = !row.isPaid;
  }
  

  toggleServices(userId:string,isPaid:boolean) {
    console.log(userId);
    if (isPaid) {
      this.http.put(`${this.apiUrl}/${userId}/resume`, {}).subscribe(
        (response) => {
          this.message = 'Services resumed successfully';
        },
        (error) => {
          this.message = 'Error resuming services';
        }
      );
    } else {
      this.http.put(`${this.apiUrl}/${userId}/terminate`, {}).subscribe(
        (response) => {
          this.message = 'Services terminated successfully';
        },
        (error) => {
          this.message = 'Error terminating services';
        }
      );
    }
  }


  csvData: String='';
  parsedCsvData: string[][]=[];
  myCsv:Csv|undefined
  invoiceData:any=[];
  selectedRow: number | null = null;

  selectRow(user_plan_id: number) 
  {
    this.selectedRow = user_plan_id;
  }
  


  constructor(private service:UserService, private http:HttpClient)
  { 


  }

  private parseCsvData(): void
  {
    if(this.csvData){
      this.parsedCsvData=this.csvData.split('\n').map(row => row.split('|').map(cell => cell.trim()));
    }
  }

  ngOnInit():void
  {
    this.service.getInvoices().subscribe(
      (data:any)=>{
        this.invoiceData=data;
        console.log(this.invoiceData[1]);
        
      },
      (error)=>{
        console.log('Error fetching',error);
        
      }
    )
  }

  


  sendEmail(
    email: string,
    username: string,
    price: string,
    activation_date: string,
    expiry_date: string,
    planname: string,
    phone: string
  ): void {

    

    // Create an object with the data you want to send to the backend
    const emailData = {
      email: email,
      username: username,
      price: price,
      activation_date: activation_date,
      expiry_date: expiry_date,
      planname: planname,
      phone: phone
    };
  
    // Make an HTTP POST request to send the data to the backend
    this.http.post('http://localhost:8586/admin', emailData).subscribe(
      (response) => {
        console.log('Email sent successfully:', response);
        Swal.fire(
          'Email sent Successfully',
          '',
          'success'
        )
        // Handle any success logic here
      },
      (error) => {
        console.error('Email sending failed:', error);
        Swal.fire({
          icon:'error',
          title:'Error Sending Mail'   
        })
        // Handle any error or failure here
      }
    );
  }

}
