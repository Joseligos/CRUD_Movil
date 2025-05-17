import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular/standalone';
import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, IonToolbar, IonFab, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonItemOption, IonItemOptions, IonItemSliding, IonTitle, IonHeader, IonImg, IonThumbnail } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MultimediaHeroe } from '../../interfaces/multimediaheroe.interface';
import { MultimediaHeroeService } from '../../services/multimediaheroe.service';
import { HeroesBDService } from '../../services/heroes-bd.service';
import { MultimediaService } from '../../services/multimedia.service';
import { addIcons } from 'ionicons';
import { add, create, trash, image, person } from 'ionicons/icons';

@Component({
  selector: 'app-multimediaheroe-list',
  templateUrl: './multimediaheroe-list.component.html',
  styleUrls: ['./multimediaheroe-list.component.scss'],  
  standalone: true,
  imports: [IonButton, IonButtons, IonContent, IonIcon, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, CommonModule, RouterModule, IonToolbar, IonFab, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonItemOption, IonItemOptions, IonItemSliding, IonTitle, IonHeader, IonImg, IonThumbnail]
})
export class MultimediaHeroeListComponent implements OnInit {
  
  multimediaHeroes: any[] = [];
  loading = false;
  heroes: any[] = [];
  multimedias: any[] = [];
  
  constructor(
    private multimediaHeroeService: MultimediaHeroeService,
    private heroesService: HeroesBDService,
    private multimediaService: MultimediaService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({ add, create, trash, image, person });
  }

  ngOnInit() {
    this.loadSequential();
  }
  
  async loadSequential() {
    try {
      this.loading = true;
      
      // Load heroes first
      await this.loadHeroesPromise();
      console.log('Heroes loaded:', this.heroes);
      
      // Load multimedias second
      await this.loadMultimediasPromise();
      console.log('Multimedias loaded:', this.multimedias);
      
      // Load multimedia-heroes last
      await this.loadMultimediaHeroesPromise();
      console.log('MultimediaHeroes loaded:', this.multimediaHeroes);
      
    } catch (error) {
      console.error('Error loading data sequentially:', error);
      this.presentToast('Error al cargar los datos');
    } finally {
      this.loading = false;
    }
  }
  
  // Promise-based methods to ensure sequential loading
  
  loadHeroesPromise(): Promise<void> {
    return new Promise((resolve, reject) => {
      const loading = this.loadingCtrl.create({
        message: 'Cargando héroes...'
      }).then(loader => {
        loader.present();
        
        this.heroesService.getHeroes().subscribe({
          next: (resp: any) => {
            if (resp && resp.Ok) {
              this.heroes = resp.resp || [];
              loader.dismiss();
              resolve();
            } else {
              this.presentToast('Error al cargar héroes');
              loader.dismiss();
              reject('Error al cargar héroes');
            }
          },
          error: (err: any) => {
            console.error('Error al cargar héroes:', err);
            this.presentToast('Error al cargar héroes');
            loader.dismiss();
            reject(err);
          }
        });
      });
    });
  }
  
  loadMultimediasPromise(): Promise<void> {
    return new Promise((resolve, reject) => {
      const loading = this.loadingCtrl.create({
        message: 'Cargando multimedias...'
      }).then(loader => {
        loader.present();
        
        this.multimediaService.getMultimedias().subscribe({
          next: (resp: any) => {
            if (resp && resp.Ok) {
              this.multimedias = resp.resp || [];
              loader.dismiss();
              resolve();
            } else {
              this.presentToast('Error al cargar multimedias');
              loader.dismiss();
              reject('Error al cargar multimedias');
            }
          },
          error: (err: any) => {
            console.error('Error al cargar multimedias:', err);
            this.presentToast('Error al cargar multimedias');
            loader.dismiss();
            reject(err);
          }
        });
      });
    });
  }
  
  loadMultimediaHeroesPromise(): Promise<void> {
    return new Promise((resolve, reject) => {
      const loading = this.loadingCtrl.create({
        message: 'Cargando asociaciones multimedia-héroe...'
      }).then(loader => {
        loader.present();
        
        this.multimediaHeroeService.getMultimediaHeroe().subscribe({
          next: (resp: any) => {
            console.log('Response from getMultimediaHeroe:', resp);
            if (resp && resp.Ok) {
              this.multimediaHeroes = resp.resp || [];
              loader.dismiss();
              resolve();
            } else {
              this.multimediaHeroes = [];
              this.presentToast('Error al cargar asociaciones multimedia-héroe');
              loader.dismiss();
              reject('Error al cargar asociaciones');
            }
          },
          error: (err: any) => {
            console.error('Error detallado:', err);
            this.multimediaHeroes = [];
            let errorMsg = 'Error al cargar asociaciones multimedia-héroe';
            
            if (err.error && err.error.msg) {
              errorMsg += `: ${err.error.msg}`;
            } else if (err.status) {
              errorMsg += ` (${err.status})`;
            }
            
            this.presentToast(errorMsg);
            loader.dismiss();
            reject(err);
          }
        });
      });
    });
  }
    getHeroeNombre(heroe: any): string {
    const heroeId = typeof heroe === 'string' ? heroe : heroe?._id;
    console.log('Getting hero name for ID:', heroeId, 'from heroes:', this.heroes);
    const encontrado = this.heroes.find(h => h._id === heroeId);
    return encontrado ? encontrado.nombre : (heroe?.nombre || heroeId || 'Héroe no encontrado');
  }
    getMultimediaUrl(multimedia: any): string {
    const multimediaId = typeof multimedia === 'string' ? multimedia : multimedia?._id;
    console.log('Getting multimedia URL for ID:', multimediaId, 'from multimedias:', this.multimedias);
    const encontrado = this.multimedias.find(m => m._id === multimediaId);
    
    let url = encontrado ? encontrado.url : (multimedia?.url || '');
    
    // Check if URL is not empty and doesn't start with http or https
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      // Assume it's a relative path and add a default prefix if needed
      if (!url.startsWith('/')) {
        url = '/' + url;
      }
    }
    
    // Provide a fallback image if no URL is found
    return url || 'assets/icon/no-image.png';
  }
  
  async deleteMultimediaHeroe(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Está seguro que desea eliminar esta asociación multimedia-héroe?',
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
    
    this.multimediaHeroeService.eliminarMultimediaHeroe(id).subscribe({
      next: (resp: any) => {
        if (resp.Ok) {
          this.presentToast('Asociación eliminada correctamente');
          this.loadSequential();
        } else {
          this.presentToast('Error al eliminar la asociación');
        }
        loading.dismiss();
      },
      error: (err: any) => {
        console.error('Error al eliminar:', err);
        this.presentToast('Error al eliminar la asociación');
        loading.dismiss();
      }
    });
  }
  
  async doRefresh(event: any) {
    await this.loadSequential();
    event.target.complete();
  }
  
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}
