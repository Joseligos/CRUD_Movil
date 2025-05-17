import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular/standalone';
import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, IonToolbar, IonFab, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonItemOption, IonItemOptions, IonItemSliding, IonTitle, IonHeader } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GrupoMultimedia } from '../../interfaces/grupo-multimedia.interface';
import { GrupoMultimediaService } from '../../services/grupo-multimedia.service';

@Component({
  selector: 'app-grupo-multimedia-list',
  templateUrl: './grupo-multimedia-list.component.html',
  styleUrls: ['./grupo-multimedia-list.component.scss'],
  standalone: true,
  imports: [IonButton, IonButtons, IonContent, IonIcon, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, CommonModule, RouterModule, IonToolbar, IonFab, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonItemOption, IonItemOptions, IonItemSliding, IonTitle, IonHeader]
})
export class GrupoMultimediaListComponent implements OnInit {
  
  grupos: GrupoMultimedia[] = [];
  loading = false;
  totalGrupos = 0;
  
  constructor(
    private grupoService: GrupoMultimediaService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadGrupos();
  }
  async loadGrupos() {
    this.loading = true;
    
    const loading = await this.loadingCtrl.create({
      message: 'Cargando grupos...'
    });
    await loading.present();
    
    console.log('Iniciando petición getGrupoMultimedias');
    this.grupoService.getGrupoMultimedias().subscribe({
      next: (resp) => {
        console.log('Respuesta recibida:', resp);
        if (resp.Ok) {
          this.grupos = resp.resp as GrupoMultimedia[];
          this.totalGrupos = resp.total || 0;
        } else {
          this.presentToast('Error al cargar grupos multimedia');
        }
        this.loading = false;
        loading.dismiss();
      },      error: (err) => {
        console.error('Error detallado:', err);
        let errorMsg = 'Error al cargar grupos multimedia';
        
        if (err.error && err.error.msg) {
          errorMsg += `: ${err.error.msg}`;
        } else if (err.status) {
          errorMsg += ` (${err.status})`;
        }
        
        this.presentToast(errorMsg);
        this.loading = false;
        loading.dismiss();
      }
    });
  }
  
  async deleteGrupo(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Está seguro que desea eliminar este grupo multimedia?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.confirmDelete(id);
          }
        }
      ]
    });
    
    await alert.present();
  }
  
  async confirmDelete(id: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Eliminando...'
    });
    await loading.present();
    
    this.grupoService.deleteGrupoMultimedia(id).subscribe({
      next: (resp) => {
        loading.dismiss();
        if (resp.Ok) {
          this.presentToast('Grupo multimedia eliminado correctamente');
          this.loadGrupos();
        } else {
          this.presentToast('Error al eliminar el grupo multimedia');
        }
      },
      error: (err) => {
        loading.dismiss();
        console.error(err);
        this.presentToast('Error al eliminar el grupo multimedia');
      }
    });
  }
  
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    
    await toast.present();
  }
  
  doRefresh(event: any) {
    this.loadGrupos();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}