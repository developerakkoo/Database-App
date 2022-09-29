import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  serverName:String;
  userName: String;
  serverPassword: String;

  constructor(private http: HttpClient, 
              private router: Router,
              private loadingController: LoadingController,
              private alertController: AlertController) { }

  ngOnInit() {
  }

  async presentAlertConfirm(msg: string, head:string, isSuccess: boolean) {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: head,
      message: msg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            if(isSuccess == true){
              this.router.navigate(['choose-options'])
            }
            if(isSuccess == false){
              console.log("Cancelled");
              
            }
          }
        }
      ]
    });
  
    await alert.present();
  }

  async onSubmit(){
    let loading = await this.loadingController.create({
      message: "Connecting to your database...",
      mode: 'ios',
      spinner: 'lines',
      duration: 3000
    })

    await loading.present();
    this.presentAlertConfirm("The Verification is Successfull", "Verification Success!", true);

  }

}
