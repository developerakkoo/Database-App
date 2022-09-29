import { AlertController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  databases: any[] =[
    {
      id: 1,
      name: 'Orders'
    },
    {
      id: 2,
      name: 'Users'
    },
    {
      id: 3,
      name: 'Work'
    },
    {
      id: 4,
      name: 'Admin'
    }
  ]
  constructor(private http: HttpClient,
              private alertController: AlertController,
              private loadingController: LoadingController) {}

  async onDownload(){
    let loading = await this.loadingController.create({
      message:"Downloading...",
      mode:'ios',
      spinner:'lines',
      duration: 3000
    })
    await loading.present();
    console.log("Download");
    
  }
}
