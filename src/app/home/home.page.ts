import { AlertController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  databases: any[] =[
   
  ];
  tables: any[] =[
   
  ];

  views: any[] =[
   
  ];
  @ViewChild('btn', {static: false}) btn: ElementRef;
  selectedDatabase:any;
  selectedTable:any;
  selectedSeparator: any = ',';
  selectedFileType: any = '';

  downloadUrl;
  isUrlSet: boolean = false;

  isTable: boolean = true;
  isSingle: boolean;

  constructor(private http: HttpClient,
              private alertController: AlertController,
              private loadingController: LoadingController) {

                this.getAllDatabases();
              }


              DatabaseSelectEvent(event){
                console.log(event.detail.value);
                this.selectedDatabase = event.detail.value;
                this.getAllTablesByDatabase();
                
              }

              tableViewSelectEvent(event){
                console.log(event.detail.value);
                if(event.detail.value == "table"){
                  this.isTable = true;
                  console.log("Table Enabled");
                  
                }
                if(event.detail.value == "view"){
                  this.isTable = false;
                  console.log("View Enabled");
                  
                }
                
              }

              tableSelectEvent(ev){
                if(ev.detail.value.length == 1){
                this.selectedTable = ev.detail.value;
                  
                  console.log(this.selectedTable);
                  console.log("Single table value");

                  return;
                }
                if(ev.detail.value.length > 1){
                  let firstTable = ev.detail.value[0];
                  let secondTable = ev.detail.value[1];
                  this.selectedTable = firstTable + ","+secondTable;

                  console.log(this.selectedTable);
                  console.log("Multiple table value");
                  return;
                }
                
              }

              singleOrMultipleEvent(ev){
                console.log(ev.detail.value);
                let value = ev.detail.value;
                if(value == 'single'){
                  this.isSingle = true;
                  return;
                }
                if(value == 'multiple'){
                  this.isSingle = false;
                  return;
                  }
                

                
              }

              fileTypeEvent(event){
                this.selectedFileType = event.detail.value;
                console.log(this.selectedFileType);
                
              }
            
              seperatorTypeEvent(event){
                this.selectedSeparator = event.detail.value;
                console.log(this.selectedSeparator);
                
              }

  async onDownload(){
  this.isUrlSet = false;
  {
    let loading = await this.loadingController.create({
      message:"Downloading...",
      mode:'ios',
      spinner:'lines',
      duration: 3000
    })
    await loading.present();
    if(this.isSingle == true){
      console.log("Sending single "+ this.selectedTable);
      
      this.http.post(environment
        .API+ `/${this.selectedFileType}/`, {
          dbname: this.selectedDatabase,
          tablename: this.selectedTable,
          separator: this.selectedSeparator
        }).subscribe((file) =>{
          console.log(file);
          console.log(file['file'].split('/').splice(1).join('/'));
          let files = file['file'].split('/').splice(1).join('/');
          // console.log(`http://localhost:3000/static/${files[1]/files[2]}`);
          this.downloadUrl = `http://localhost:3000/static/${files}`;
          // let downloadURL = window.URL.createObjectURL(this.downloadUrl);
          // console.log(downloadURL);
          let a = document.getElementById("download");
          a.setAttribute("href", this.downloadUrl);
          this.isUrlSet = true;
          this.btn.nativeElement.click();
        },(error) =>{
          console.log(error);
          this.isUrlSet = false;
          
        })
        return;
    }
    else if(this.isSingle == false){
      console.log("Sending Multiple " + this.selectedTable);

      this.http.post(environment
        .API+ `/${this.selectedFileType}/multi`, {
          dbname: this.selectedDatabase,
          tablename: this.selectedTable,
          separator: this.selectedSeparator
        }).subscribe((file) =>{
          console.log(file['filePaths']);
          // console.log(file['filePaths'][0].split('/').splice(1).join('/'));
          // console.log(file['filePaths'][1].split('/').splice(1).join('/'));
          for(let i =0; i<= file['filePaths'].length - 1; i++){
            console.log(file['filePaths'][i].split('/').splice(1).join('/'));
            this.downloadUrl = `http://localhost:3000/static/${file['filePaths'][i].split('/').splice(1).join('/')}`;
            let a = document.createElement("a");

            a.setAttribute("href", this.downloadUrl);
            console.log(a);
            a.download = file['filePaths'][i].split('/').splice(1).join('/');
            a.click();
            this.isUrlSet = true;
            this.btn.nativeElement.click();
          }
          // let files = file['filePaths'].split('/').splice(1).join('/');
          // console.log(`http://localhost:3000/static/${files[1]/files[2]}`);
         
        },(error) =>{
          console.log(error);
          this.isUrlSet = false;
          
        })

        return;
    }
    console.log("Download");
    
  }

}



  async getAllDatabases(){
    this.http.get(environment.API +'/databases').subscribe((dbs) =>{
      console.log(dbs);
      this.databases = dbs['result'];
      
    }, async (error) =>{
      console.log(error);
      
    })
  }


  async getAllTablesByDatabase(){
    this.http.post(environment.API +'/database', {'dbname': this.selectedDatabase}).subscribe((dbs) =>{
      console.log(dbs);
      this.tables = dbs['result'];
      
      
    }, async (error) =>{
      console.log(error);
      
    })
  }
}
