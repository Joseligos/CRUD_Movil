import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonTitle, IonToolbar, LoadingController, ToastController } from '@ionic/angular/standalone';
import { MultimediaHeroe } from '../../interfaces/multimediaheroe.interface';
import { MultimediaHeroeService } from '../../services/multimediaheroe.service';
import { MultimediaService } from '../../services/multimedia.service';
import { HeroesBDService } from '../../services/heroes-bd.service';
import { DataLoaderService } from '../../services/data-loader.service';
import { addIcons } from 'ionicons';
import { save, arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-multimediaheroe-edit',
  templateUrl: './multimediaheroe-edit.component.html',
  styleUrls: ['./multimediaheroe-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonSelect,
    IonSelectOption
  ]
})
export class MultimediaHeroeEditComponent implements OnInit {
  multimediaHeroe: MultimediaHeroe = {
    IdHeroe: '',
    IdMultimedia: ''
  };
  
  isNew = true;
  heroes: any[] = [];
  multimedias: any[] = [];
    constructor(
    private route: ActivatedRoute,
    private router: Router,
    private multimediaHeroeService: MultimediaHeroeService,
    private multimediaService: MultimediaService,
    private heroesService: HeroesBDService,
    private dataLoader: DataLoaderService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({ save, arrowBack });
  }

  ngOnInit() {
    this.loadHeroes();
    this.loadMultimedias();
    
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id && id !== 'new') {
      this.isNew = false;
      this.loadMultimediaHeroe(id);
    }
  }
    async loadHeroes() {
    this.heroesService.getHeroes().subscribe({
      next: (resp: any) => {
        if (resp.Ok) {
          this.heroes = resp.resp;
        } else {
          this.presentToast('Error al cargar los héroes');
        }
      },
      error: (err: any) => {
        console.error('Error al cargar héroes:', err);
        this.presentToast('Error al cargar los héroes');
      }
    });
  }
  
  async loadMultimedias() {
    this.multimediaService.getMultimedias().subscribe({
      next: (resp: any) => {
        if (resp.Ok) {
          this.multimedias = resp.resp;
        } else {          this.presentToast('Error al cargar las multimedias');
        }
      },
      error: (err: any) => {
        console.error('Error al cargar multimedias:', err);
        this.presentToast('Error al cargar las multimedias');
      }
    });
  }
  
  async loadMultimediaHeroe(id: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando asociación...'
    });
    await loading.present();
    
    this.multimediaHeroeService.getMultimediaHeroePorId(id).subscribe({
      next: (resp: any) => {
        if (resp.Ok && resp.resp) {
          this.multimediaHeroe = resp.resp;
        } else {
          this.presentToast('Error al cargar la asociación');
          this.router.navigate(['/tabs/multimediaheroe']);        }
        loading.dismiss();
      },
      error: (err: any) => {
        console.error('Error detallado:', err);
        this.presentToast('Error al cargar la asociación');
        this.router.navigate(['/tabs/multimediaheroe']);
        loading.dismiss();
      }
    });
  }
    async saveMultimediaHeroe() {
    if (!this.multimediaHeroe.IdHeroe || !this.multimediaHeroe.IdMultimedia) {
      this.presentToast('Por favor, complete todos los campos requeridos');
      return;
    }
    
    const loading = await this.loadingCtrl.create({
      message: this.isNew ? 'Creando asociación...' : 'Actualizando asociación...'
    });
    await loading.present();
    
    if (this.isNew) {
      this.multimediaHeroeService.crearMultimediaHeroe(this.multimediaHeroe).subscribe({
        next: (resp: any) => {
          if (resp.Ok) {
            this.presentToast('Asociación creada correctamente');
            
            // Recargar datos antes de navegar
            this.dataLoader.loadAllData().then(() => {
              this.router.navigate(['/tabs/multimediaheroe']);
            });
          } else {
            this.presentToast('Error al crear la asociación');          }
          loading.dismiss();
        },
        error: (err: any) => {
          console.error('Error al crear:', err);
          let errorMsg = 'Error al crear la asociación';
          
          if (err.error && err.error.msg) {
            errorMsg += `: ${err.error.msg}`;
          }
          
          this.presentToast(errorMsg);
          loading.dismiss();
        }
      });
    } else {
      this.multimediaHeroeService.actualizarMultimediaHeroe(this.multimediaHeroe).subscribe({
        next: (resp: any) => {
          if (resp.Ok) {
            this.presentToast('Asociación actualizada correctamente');
            
            // Recargar datos antes de navegar
            this.dataLoader.loadAllData().then(() => {
              this.router.navigate(['/tabs/multimediaheroe']);
            });
          } else {
            this.presentToast('Error al actualizar la asociación');          }
          loading.dismiss();
        },
        error: (err: any) => {
          console.error('Error al actualizar:', err);
          let errorMsg = 'Error al actualizar la asociación';
          
          if (err.error && err.error.msg) {
            errorMsg += `: ${err.error.msg}`;
          }
          
          this.presentToast(errorMsg);
          loading.dismiss();
        }
      });
    }
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
