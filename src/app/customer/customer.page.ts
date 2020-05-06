import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../app.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit, OnDestroy {

  shopName: string;
  message: string;
  mobileNumber: number;
  currentToken: number;
  eta: number;
  tokenNo: number;
  tokenGenerated = false;
  private routeSub: Subscription;

  constructor(
    private appService: AppService,
    private httpClient: HttpClient,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.shopName = params.shopName;
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  generateToken() {
    if (!this.isValidMobileNumber()) {
      this.appService.presentToast('Invalid Mobile Number', 'danger');
      return;
    }
    this.appService.showLoader.next(true);
    this.httpClient.post('https://asia-east2-etoken-ecd58.cloudfunctions.net/api/generateToken', {
      shopName: this.shopName,
      mobileNo: this.mobileNumber
    })
      .subscribe(
        (res) => {
          if (res) {
            /* tslint:disable:no-string-literal */
            this.currentToken = res['currentToken'];
            this.message = res['message'];
            this.eta = res['eta'];
            this.tokenNo = res['tokenNo'];
            this.shopName = res['shopNameDisplay'];
            /* tslint:enable:no-string-literal */
          }
          this.tokenGenerated = true;
          this.appService.showLoader.next(false);
        },
        (err) => { this.appService.presentToast(err.error.error, 'danger'); this.appService.showLoader.next(false); }
      );
  }

  isValidMobileNumber(): boolean {
    const phoneRe = /^[6-9]\d{9}$/;
    return phoneRe.test(this.mobileNumber.toString());
  }

}
