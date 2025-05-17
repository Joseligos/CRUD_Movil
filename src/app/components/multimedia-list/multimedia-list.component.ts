import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular/standalone';
import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, IonToolbar, IonFab, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonItemOption, IonItemOptions, IonItemSliding, IonTitle, IonHeader, IonThumbnail } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Multimedia } from '../../interfaces/multimedia.interface';
import { MultimediaService } from '../../services/multimedia.service';
import { GrupoMultimediaService } from '../../services/grupo-multimedia.service';
import { addIcons } from 'ionicons';
import { add, create, trash, image, document } from 'ionicons/icons';

@Component({
  selector: 'app-multimedia-list',
  templateUrl: './multimedia-list.component.html',
  styleUrls: ['./multimedia-list.component.scss'],  standalone: true,
  imports: [IonButton, IonButtons, IonContent, IonIcon, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, CommonModule, RouterModule, IonToolbar, IonFab, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonItemOption, IonItemOptions, IonItemSliding, IonTitle, IonHeader, IonThumbnail]
})
export class MultimediaListComponent implements OnInit {
  
  multimedias: Multimedia[] = [];
  loading = false;
  totalMultimedias = 0;
  grupos: any[] = []; // Added to store grupos for name lookup
    constructor(
    private multimediaService: MultimediaService,
    private grupoService: GrupoMultimediaService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController  ) {
    addIcons({ add, create, trash, image, document });
  }

  ngOnInit() {
    this.loadMultimedias();
    this.loadGrupos();
  }
  
  async loadMultimedias() {
    this.loading = true;
    
    const loading = await this.loadingCtrl.create({
      message: 'Cargando multimedias...'
    });
    await loading.present();
    
    console.log('Iniciando petición getMultimedias');
    this.multimediaService.getMultimedias().subscribe({
      next: (resp) => {
        console.log('Respuesta recibida:', resp);
        if (resp.Ok) {
          this.multimedias = resp.resp as Multimedia[];
          this.totalMultimedias = resp.total || 0;
        } else {
          this.presentToast('Error al cargar multimedias');
        }
        this.loading = false;
        loading.dismiss();
      },
      error: (err) => {
        console.error('Error detallado:', err);
        let errorMsg = 'Error al cargar multimedias';
        
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
  
  async loadGrupos() {
    this.grupoService.getGrupoMultimedias().subscribe({
      next: (resp) => {
        if (resp.Ok) {
          this.grupos = resp.resp as any[];
        }
      },
      error: (err) => {
        console.error('Error al cargar grupos:', err);
      }
    });
  }
  
  getGrupoNombre(grupo: any): string {
    const grupoId = typeof grupo === 'string' ? grupo : grupo?._id;
    const encontrado = this.grupos.find(g => g._id === grupoId);
    return encontrado ? encontrado.nombre : (grupo?.nombre || grupoId || 'Desconocido');
  }
  
  async deleteMultimedia(id: string, url: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro que desea eliminar la multimedia "${url}"?`,
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
    
    console.log('Deleting multimedia with ID:', id);
    this.multimediaService.deleteMultimedia(id).subscribe({
      next: (resp) => {
        loading.dismiss();
        console.log('Delete response:', resp);
        if (resp.Ok) {
          this.presentToast('Multimedia eliminada correctamente');
          
          // Filter out the deleted item from the local array immediately
          this.multimedias = this.multimedias.filter(m => m._id !== id);
          
          // Then reload from server to ensure data is fresh
          setTimeout(() => {
            this.loadMultimedias();
          }, 300);
        } else {
          let errorMsg = 'Error al eliminar la multimedia';
          if (resp.resp && typeof resp.resp === 'string') {
            errorMsg += `: ${resp.resp}`;
          }
          this.presentToast(errorMsg);
        }
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error durante la eliminación:', err);
        let errorMsg = 'Error al eliminar la multimedia';
        
        if (err.error) {
          if (err.error.msg) {
            errorMsg += `: ${err.error.msg}`;
          } else if (err.error.message) {
            errorMsg += `: ${err.error.message}`;
          }
        }
        
        this.presentToast(errorMsg);
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
    this.loadMultimedias();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  isImageUrl(url: string): boolean {
    return url.match(/\.(jpeg|jpg|gif|png)$/) !== null || url.startsWith('data:image/');
  }
}
