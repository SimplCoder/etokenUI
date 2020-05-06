import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.page.html',
  styleUrls: ['./page-not-found.page.scss'],
})
export class PageNotFoundPage implements OnInit {
  shopName: string;
  secretKey: string;

  constructor(private router: Router, private appService: AppService) { }

  ngOnInit() {
  }

  navigate() {
    if (this.secretKey && this.shopName) {
      this.router.navigate(['/admin', this.shopName, this.secretKey]);
    } else if (this.shopName) {
      this.router.navigate(['/customer', this.shopName]);
    } else {
      this.appService.presentToast('Input valid details', 'danger');
    }
  }
}
