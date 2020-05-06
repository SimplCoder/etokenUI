import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  shopName: string;
  secretKey: string;
  timeTakenToServer = 2;
  currentToken: number;
  message: string;
  timeToken: number;
  totalToken: number;
  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute, private httpClient: HttpClient,
    private appService: AppService) {
  }
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.shopName = params.shopName;
      this.secretKey = params.shopKey;
    });
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
        (err) => { this.appService.presentToast(err.error.error, 'danger'); this.appService.showLoader.next(false); }
      );
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
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
            this.appService.presentToast('Counter Updated', 'success');
          }
          this.appService.showLoader.next(false);
        },
        (err) => { this.appService.presentToast(err.error.error, 'danger'); this.appService.showLoader.next(false); }
      );
  }


  
  onResetClick() {
    if(confirm("Are you sure to reset all tokens ")) {
    this.appService.showLoader.next(true);
    this.httpClient.post('https://asia-east2-etoken-ecd58.cloudfunctions.net/api/resetToken', {
      shopName: this.shopName,
      shopSecret: this.secretKey
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
            this.appService.presentToast('All Token got reset', 'success');
          }
          this.appService.showLoader.next(false);
        },
        (err) => { this.appService.presentToast(err.error.error, 'danger'); this.appService.showLoader.next(false); }
      );
    }
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
            this.appService.presentToast('Information Updated Successfully', 'success');
          }
          this.appService.showLoader.next(false);
        },
        (err) => { this.appService.presentToast(err.error.error, 'danger'); this.appService.showLoader.next(false); }
      );
  }
}
