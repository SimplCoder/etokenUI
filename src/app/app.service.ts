import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  showLoader = new Subject<boolean>();
  constructor(private toastController: ToastController) { }

  async presentToast(msg: string, type: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: type,
      position: 'top'
    });
    toast.present();
  }
}
