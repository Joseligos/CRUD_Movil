import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular/standalone';
import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, IonToolbar, IonFab, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonItemOption, IonItemOptions, IonItemSliding, IonTitle, IonHeader, IonImg, IonThumbnail, IonSpinner } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MultimediaHeroe } from '../../interfaces/multimediaheroe.interface';
import { MultimediaHeroeService } from '../../services/multimediaheroe.service';
import { HeroesBDService } from '../../services/heroes-bd.service';
import { MultimediaService } from '../../services/multimedia.service';
import { DataLoaderService } from '../../services/data-loader.service';
import { addIcons } from 'ionicons';
import { add, create, trash, image, person } from 'ionicons/icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-multimediaheroe-list',
  templateUrl: './multimediaheroe-list.component.html',
  styleUrls: ['./multimediaheroe-list.component.scss'],  
  standalone: true,
  imports: [IonButton, IonButtons, IonContent, IonIcon, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, CommonModule, RouterModule, IonToolbar, IonFab, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonItemOption, IonItemOptions, IonItemSliding, IonTitle, IonHeader, IonImg, IonThumbnail, IonSpinner]
})
export class MultimediaHeroeListComponent implements OnInit, OnDestroy {
  
  multimediaHeroes: any[] = [];
  heroes: any[] = [];
  multimedias: any[] = [];
  loading = false;
  
  private subscriptions: Subscription[] = [];
  
  constructor(
    private multimediaHeroeService: MultimediaHeroeService,
    private dataLoader: DataLoaderService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({ add, create, trash, image, person });
  }

  ngOnInit() {
    // Cargar datos al iniciar el componente
    this.loadData();
    
    // Suscribirnos a los observables del servicio DataLoader
    this.subscriptions.push(
      this.dataLoader.heroes$.subscribe(heroes => {
        this.heroes = heroes;
        console.log('Heroes updated in component:', heroes.length);
      }),
      
      this.dataLoader.multimedias$.subscribe(multimedias => {
        this.multimedias = multimedias;
        console.log('Multimedias updated in component:', multimedias.length);
      }),
      
      this.dataLoader.multimediaHeroes$.subscribe(multimediaHeroes => {
        this.multimediaHeroes = multimediaHeroes;
        console.log('MultimediaHeroes updated in component:', multimediaHeroes.length);
      }),
      
      this.dataLoader.loading$.subscribe(loading => {
        this.loading = loading;
      })
    );
  }
  
  ngOnDestroy() {
    // Limpiar todas las suscripciones al destruir el componente
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  async loadData() {
    await this.dataLoader.loadAllData();
  }
  
  async doRefresh(event: any) {
    console.log('Pull to refresh triggered');
    await this.dataLoader.loadAllData(false);
    event.target.complete();
    this.presentToast('Datos actualizados');
  }
  
  getHeroeNombre(heroe: any): string {
    const heroeId = typeof heroe === 'string' ? heroe : heroe?._id;
    console.log('Getting hero name for ID:', heroeId);
    const encontrado = this.heroes.find(h => h._id === heroeId);
    return encontrado ? encontrado.nombre : (heroe?.nombre || heroeId || 'Héroe no encontrado');
  }
    
  getMultimediaUrl(multimedia: any): string {
    const multimediaId = typeof multimedia === 'string' ? multimedia : multimedia?._id;
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
          // Recargar los datos después de eliminar
          this.loadData();
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
  
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}
