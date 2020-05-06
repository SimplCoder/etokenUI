import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../app.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit, OnDestroy {

  shopName: string;
  shopDisplay:string="";
  message: string;
  mobileNumber: number;
  oldMobilenumber:number;
  currentToken: number;
  eta: number;
  tokenNo: number;
  refreshTime:number;
  tokenGenerated = false;
  doRefresh:boolean=true;
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
      this.shopDisplay=params.shopName;
    });
  }

  ngOnDestroy() {
    this.doRefresh=false;
    this.routeSub.unsubscribe();
  }
  autoRefresh(){
    (function theLoop (i: number) {
      setTimeout(() => {
          this.generateToken();
          if (--i) {
              theLoop(i);
          }
      }, 3000);
  })(10);
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
            this.shopDisplay = res['shopNameDisplay'];
            this.oldMobilenumber=this.mobileNumber;
            this.refreshTime= res['refreshTime'];
            /* tslint:enable:no-string-literal */
          }
          this.tokenGenerated = true;
        
          this.appService.showLoader.next(false);
          setTimeout(() => {
            if( this.oldMobilenumber==this.mobileNumber&& this.doRefresh)  
               this.generateToken();
        }, this.refreshTime);
        },
        (err) => { this.appService.presentToast(err.error.error, 'danger'); this.appService.showLoader.next(false); }
      );
  }

  isValidMobileNumber(): boolean {
    const phoneRe = /^[2-9]\d{9}$/;
    return phoneRe.test(this.mobileNumber.toString());
  }

}
