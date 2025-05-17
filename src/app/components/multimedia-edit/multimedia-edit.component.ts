import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular/standalone';
import { IonButton, IonButtons, IonContent, IonItem, IonLabel, IonInput, IonCard, IonCardHeader, IonCardContent, IonBackButton, 
  IonHeader, IonToolbar, IonTitle, IonText, IonSelect, IonSelectOption, IonFooter } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Multimedia } from '../../interfaces/multimedia.interface';
import { MultimediaService } from '../../services/multimedia.service';
import { GrupoMultimediaResponse, GrupoMultimedia } from '../../interfaces/grupo-multimedia.interface';
import { GrupoMultimediaService } from '../../services/grupo-multimedia.service';

@Component({
  selector: 'app-multimedia-edit',
  templateUrl: './multimedia-edit.component.html',
  styleUrls: ['./multimedia-edit.component.scss'],
  standalone: true,
  imports: [IonButton, IonButtons, IonContent, IonItem, IonLabel, IonInput, IonCard, IonCardHeader, IonCardContent, IonBackButton,
     IonHeader, IonToolbar, IonTitle, IonText, IonSelect, IonSelectOption, CommonModule, ReactiveFormsModule, RouterModule, IonFooter]
})
export class MultimediaEditComponent implements OnInit {
  
  multimediaForm!: FormGroup;
  isEdit = false;
  multimediaId = '';
  multimedia: Multimedia | null = null;
  submitted = false;
  grupos: GrupoMultimedia[] = [];
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private multimediaService: MultimediaService,
    private grupoService: GrupoMultimediaService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.multimediaForm = this.fb.group({
      url: ['', [Validators.required]],
      tipo: [''],
      IdGrupoMultimedia: ['', [Validators.required]]
    });

    this.loadGrupos();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.multimediaId = id;
        this.loadMultimedia(id);
      }
    });
  }
  
  async loadGrupos() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando grupos...'
    });
    await loading.present();
    
    this.grupoService.getGrupoMultimedias().subscribe({
      next: (resp: GrupoMultimediaResponse) => {
        loading.dismiss();
        if (resp.Ok) {
          this.grupos = resp.resp as GrupoMultimedia[];
        } else {
          this.presentToast('Error al cargar los grupos multimedia');
        }
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error al cargar grupos:', err);
        this.presentToast('Error al cargar los grupos multimedia');
      }
    });
  }
  
  async loadMultimedia(id: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando información...'
    });
    await loading.present();
    
    console.log('Fetching multimedia with ID:', id);
    this.multimediaService.getMultimedia(id).subscribe({
      next: (resp) => {
        loading.dismiss();
        console.log('Multimedia response:', resp);
        if (resp.Ok) {
          this.multimedia = resp.resp as Multimedia;
          this.multimediaForm.setValue({
            url: this.multimedia.url,
            tipo: this.multimedia.tipo || '',
            IdGrupoMultimedia: this.multimedia.IdGrupoMultimedia
          });
        } else {
          this.presentToast('Error al cargar la multimedia');
          this.router.navigate(['/multimedia']);
        }
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error al cargar la multimedia:', err);
        let errorMessage = 'Error al cargar la multimedia';
        if (err.error && err.error.msg) {
          errorMessage = err.error.msg;
        }
        this.presentToast(errorMessage);
        this.router.navigate(['/tabs/multimedia']);
      }
    });
  }
  
  async onSubmit() {
    this.submitted = true;
    
    if (this.multimediaForm.invalid) {
      return;
    }
    
    const loading = await this.loadingCtrl.create({
      message: this.isEdit ? 'Actualizando...' : 'Creando...'
    });
    await loading.present();
    
    const multimediaData: Multimedia = {
      url: this.multimediaForm.value.url.trim(),
      tipo: this.multimediaForm.value.tipo?.trim(),
      IdGrupoMultimedia: this.multimediaForm.value.IdGrupoMultimedia
    };
    
    console.log('Enviando datos:', this.isEdit ? 'UPDATE' : 'CREATE', multimediaData);
    
    if (this.isEdit) {
      this.multimediaService.updateMultimedia(this.multimediaId, multimediaData).subscribe({
        next: (resp) => {
          loading.dismiss();
          console.log('Update response:', resp);
          if (resp.Ok) {
            this.presentToast('Multimedia actualizada correctamente');
            this.router.navigate(['/tabs/multimedia']);
          } else {
            let errorMsg = 'Error al actualizar la multimedia';
            if (resp.resp && typeof resp.resp === 'string') {
              errorMsg += `: ${resp.resp}`;
            }
            this.presentToast(errorMsg);
          }
        },
        error: (err) => {
          loading.dismiss();
          console.error('Error durante la actualización:', err);
          let errorMsg = 'Error al actualizar la multimedia';
          
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
    } else {
      this.multimediaService.createMultimedia(multimediaData).subscribe({
        next: (resp) => {
          loading.dismiss();
          console.log('Respuesta creación:', resp);
          if (resp.Ok) {
            this.presentToast('Multimedia creada correctamente');
            this.router.navigate(['/tabs/multimedia']);
          } else {
            this.presentToast('Error al crear la multimedia');
          }
        },
        error: (err) => {
          loading.dismiss();
          console.error('Error durante la creación:', err);
          if (err.error && err.error.msg) {
            this.presentToast(err.error.msg);
          } else {
            this.presentToast('Error al crear la multimedia');
          }
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
  
  get f() { 
    return this.multimediaForm.controls; 
  }
}
