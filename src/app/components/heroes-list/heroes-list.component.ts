import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Heroe } from 'src/app/interfaces/heroes.interface';
import { IonAvatar, IonItem, IonLabel, IonList, IonListHeader, IonButtons, IonIcon, IonButton } from "@ionic/angular/standalone";
import { create, heart, heartOutline, save, trash} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { HeroesBDService } from 'src/app/services/heroes-bd.service';

import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

//import { IonicModule} from '@ionic/angular';


@Component({
  selector: 'app-heroes-list',
  templateUrl: './heroes-list.component.html',
  styleUrls: ['./heroes-list.component.scss'],
  imports: [
    IonIcon,
    IonButtons,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonListHeader,
    IonAvatar,
    //IonicModule,
  ],
  standalone: true
})
export class HeroesListComponent  implements OnInit {

  @Input() heroes: Heroe[] = [];
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';

  @Output() heroeBorrado: EventEmitter<string> = new EventEmitter();

  unResultado: any;

  
  constructor(
    private router: Router,
    private bd: HeroesBDService,

    private toastController: ToastController,
    private alertController: AlertController) {
    addIcons({ heart,heartOutline, trash, create, save});
   }

  ngOnInit() {}

  verHeroe(unIdHeroe: string) {
    console.log('HEROE', unIdHeroe);
    this.router.navigate(['/heroe', unIdHeroe, 'visualizar']);
  }

  editarHeroe(unIdHeroe: string) {
    console.log('HEROE', unIdHeroe);
    this.router.navigate(['/heroe', unIdHeroe, 'editar']);
  }

  crearHeroe() {
    //console.log('HEROE', unIdHeroe);
    this.router.navigate(['/heroe', '', 'crear']);
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }

  async presentAlert(titulo: string, subtitulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      subHeader: subtitulo,
      message: mensaje,
      buttons: ['Ok'],
    });

    await alert.present();
  }

  async eliminarHeroe(unHeroe: Heroe) {
    console.log(unHeroe);
    await this.bd.crud_Heroes(unHeroe, 'eliminar').subscribe(
      (res: any) => {
        this.unResultado = res;

        //console.log(this.unResultado);
        if (this.unResultado.Ok == true) {
          this.presentToast('top', 'Registro Eliminado...');

          this.heroeBorrado.emit(unHeroe._id);
        } else {
          console.log(this.unResultado);

          //this.presentToast('middle','Registro no pudo ser Eliminado...' + this.unResultado.msg)

          this.presentAlert('Error!', 'Eliminando Heroe', this.unResultado.msg);
        }
      },
      (error: any) => {
        console.error(error);
        this.presentAlert('Error!', 'Eliminando Heroe', 'Error Desconocido...');
        this.heroeBorrado.emit('');

      }
    );
  }

}

