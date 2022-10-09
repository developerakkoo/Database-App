import { AlertController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
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
  selectedDatabase:any;
  selectedTable:any;
  selectedSeparator: any;
  selectedFileType: any;

  downloadUrl;


  isTable: boolean = true;

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
                // if(event.detail.value == "table"){
                //   this.isTable = true;
                //   console.log("Table Enabled");
                  
                // }
                // if(event.detail.value == "view"){
                //   this.isTable = false;
                //   console.log("View Enabled");
                  
                // }
                
              }

  async onDownload()
  {
    let loading = await this.loadingController.create({
      message:"Downloading...",
      mode:'ios',
      spinner:'lines',
      duration: 3000
    })
    await loading.present();
    this.http.post(environment
      .API+ '/csv/', {
        dbname: this.selectedDatabase,
        tablename: "db",
        separator: this.selectedSeparator
      }).subscribe((file) =>{
        console.log(file);
        console.log(`http://localhost:3000/static/${file['file']}`);
        this.downloadUrl = `http://localhost:3000/static/${file['file']}`;
        let downloadURL = window.URL.createObjectURL(this.downloadUrl);
        console.log(downloadURL);
        
        
        
      },(error) =>{
        console.log(error);
        
      })
    console.log("Download");
    
  }

  fileTypeEvent(event){
    this.selectedFileType = event.detail.value;
    console.log(this.selectedFileType);
    
  }

  seperatorTypeEvent(event){
    this.selectedSeparator = event.detail.value;
    console.log(this.selectedSeparator);
    
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
