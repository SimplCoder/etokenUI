import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { AppService } from '../app.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  shopName: string;
  secretKey: string;
  timeTakenToServer = 2;
  currentToken: number;
  message: string;
  timeToken: number;
  totalToken: number;

  constructor(
    private route: ActivatedRoute, private httpClient: HttpClient,
    private toastController: ToastController, private appService: AppService) {
    this.route.queryParams.subscribe(params => {
      this.shopName = params.shopName;
      this.secretKey = params.shopSecret;
    });
  }
  ngOnInit(): void {
    this.appService.showLoader.next(true);
    this.httpClient.get('https://asia-east2-etoken-ecd58.cloudfunctions.net/api/getShopDetails?shopName='
      + this.shopName + '&shopSecret=' + this.secretKey)
      .subscribe(
        (res) => {
          if (res) {
            /* tslint:disable:no-string-literal */
            this.currentToken = res['currentToken'];
            this.message = res['message'];
            this.timeToken = res['timeToken'];
            this.totalToken = res['totalToken'];
            /* tslint:enable:no-string-literal */
          }
          this.appService.showLoader.next(false);
        },
        (err) => { this.presentToast(err.error.error, 'danger');  this.appService.showLoader.next(false);}
      );
  }

  async presentToast(msg: string, type: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: type,
      position: 'top'
    });
    toast.present();
  }

  onClickUpdate() {
    this.appService.showLoader.next(true);
    this.httpClient.post('https://asia-east2-etoken-ecd58.cloudfunctions.net/api/updateShopDetails', {
      shopName: this.shopName,
      shopSecret: this.secretKey,
      message: this.message,
      timeToken: this.timeToken
    })
      .subscribe(
        (res) => {
          if (res) {
            /* tslint:disable:no-string-literal */
            this.currentToken = res['currentToken'];
            this.message = res['message'];
            this.timeToken = res['timeToken'];
            this.totalToken = res['totalToken'];
            /* tslint:enable:no-string-literal */
            this.presentToast('Information Updates Successfully', 'success');
          }
          this.appService.showLoader.next(false);
        },
        (err) => { this.presentToast(err.error.error, 'danger');  this.appService.showLoader.next(false); }
      );
  }

  UpdateToken(value: number) {
    this.appService.showLoader.next(true);
    this.httpClient.post('https://asia-east2-etoken-ecd58.cloudfunctions.net/api/increaseToken', {
      shopName: this.shopName,
      shopSecret: this.secretKey,
      increaseNo: value
    })
      .subscribe(
        (res) => {
          if (res) {
            /* tslint:disable:no-string-literal */
            this.currentToken = res['currentToken'];
            this.message = res['message'];
            this.timeToken = res['timeToken'];
            this.totalToken = res['totalToken'];
            /* tslint:enable:no-string-literal */
            this.presentToast('Information Updates Successfully', 'success');
          }
          this.appService.showLoader.next(false);
        },
        (err) => { this.presentToast(err.error.error, 'danger'); this.appService.showLoader.next(false); }
      );
  }
}
