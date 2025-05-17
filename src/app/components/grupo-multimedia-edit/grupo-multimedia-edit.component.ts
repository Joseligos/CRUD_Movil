import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular/standalone';
import { IonButton, IonButtons, IonContent, IonItem, IonLabel, IonInput, IonCard, IonCardHeader, IonCardContent, IonBackButton, IonHeader, IonToolbar, IonTitle, IonText } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { GrupoMultimedia } from '../../interfaces/grupo-multimedia.interface';
import { GrupoMultimediaService } from '../../services/grupo-multimedia.service';

@Component({
  selector: 'app-grupo-multimedia-edit',
  templateUrl: './grupo-multimedia-edit.component.html',
  styleUrls: ['./grupo-multimedia-edit.component.scss'],
  standalone: true,
  imports: [IonButton, IonButtons, IonContent, IonItem, IonLabel, IonInput, IonCard, IonCardHeader, IonCardContent, IonBackButton, IonHeader, IonToolbar, IonTitle, IonText, CommonModule, ReactiveFormsModule, RouterModule]
})
export class GrupoMultimediaEditComponent implements OnInit {
  
  grupoForm!: FormGroup;
  isEdit = false;
  grupoId = '';
  grupo: GrupoMultimedia | null = null;
  submitted = false;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private grupoService: GrupoMultimediaService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.grupoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.grupoId = id;
        this.loadGrupo(id);
      }
    });
  }
    async loadGrupo(id: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando información...'
    });
    await loading.present();
    
    console.log('Fetching grupo multimedia with ID:', id);
    this.grupoService.getGrupoMultimedia(id).subscribe({
      next: (resp) => {
        loading.dismiss();
        console.log('Grupo multimedia response:', resp);
        if (resp.Ok) {
          this.grupo = resp.resp as GrupoMultimedia;
          this.grupoForm.setValue({
            nombre: this.grupo.nombre
          });
        } else {
          this.presentToast('Error al cargar el grupo multimedia');
          this.router.navigate(['/grupo-multimedia']);
        }
      },      error: (err) => {
        loading.dismiss();
        console.error('Error al cargar el grupo:', err);
        let errorMessage = 'Error al cargar el grupo multimedia';
        if (err.error && err.error.msg) {
          errorMessage = err.error.msg;
        }
        this.presentToast(errorMessage);
        this.router.navigate(['/tabs/tab5']);
      }
    });
  }
    async onSubmit() {
    this.submitted = true;
    
    if (this.grupoForm.invalid) {
      return;
    }
    
    const loading = await this.loadingCtrl.create({
      message: this.isEdit ? 'Actualizando...' : 'Creando...'
    });
    await loading.present();
      const grupoData: GrupoMultimedia = {
      nombre: this.grupoForm.value.nombre.trim()
    };
    
    console.log('Enviando datos:', this.isEdit ? 'UPDATE' : 'CREATE', grupoData);    if (this.isEdit) {
      this.grupoService.updateGrupoMultimedia(this.grupoId, grupoData).subscribe({
        next: (resp) => {
          loading.dismiss();
          console.log('Update response:', resp);
          if (resp.Ok) {
            this.presentToast('Grupo multimedia actualizado correctamente');
            this.router.navigate(['/tabs/tab5']);
          } else {
            let errorMsg = 'Error al actualizar el grupo multimedia';
            if (resp.resp && typeof resp.resp === 'string') {
              errorMsg += `: ${resp.resp}`;
            }
            this.presentToast(errorMsg);
          }
        },
        error: (err) => {
          loading.dismiss();
          console.error('Error durante la actualización:', err);
          let errorMsg = 'Error al actualizar el grupo multimedia';
          
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
      this.grupoService.createGrupoMultimedia(grupoData).subscribe({
        next: (resp) => {
          loading.dismiss();
          console.log('Respuesta creación:', resp);
          if (resp.Ok) {
            this.presentToast('Grupo multimedia creado correctamente');
            this.router.navigate(['/tabs/tab5']);
          } else {
            this.presentToast('Error al crear el grupo multimedia');
          }
        },
        error: (err) => {
          loading.dismiss();
          console.error('Error durante la creación:', err);
          if (err.error && err.error.msg) {
            this.presentToast(err.error.msg);
          } else {
            this.presentToast('Error al crear el grupo multimedia');
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
    return this.grupoForm.controls; 
  }
}