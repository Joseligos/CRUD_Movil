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
    
    this.grupoService.getGrupoMultimedia(id).subscribe({
      next: (resp) => {
        loading.dismiss();
        if (resp.Ok) {
          this.grupo = resp.resp as GrupoMultimedia;
          this.grupoForm.setValue({
            nombre: this.grupo.nombre
          });
        } else {
          this.presentToast('Error al cargar el grupo multimedia');
          this.router.navigate(['/grupo-multimedia']);
        }
      },
      error: (err) => {
        loading.dismiss();
        console.error(err);
        this.presentToast('Error al cargar el grupo multimedia');
        this.router.navigate(['/grupo-multimedia']);
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
      nombre: this.grupoForm.value.nombre
    };
    
    if (this.isEdit) {
      this.grupoService.updateGrupoMultimedia(this.grupoId, grupoData).subscribe({
        next: (resp) => {
          loading.dismiss();
          if (resp.Ok) {
            this.presentToast('Grupo multimedia actualizado correctamente');
            this.router.navigate(['/grupo-multimedia']);
          } else {
            this.presentToast('Error al actualizar el grupo multimedia');
          }
        },
        error: (err) => {
          loading.dismiss();
          console.error(err);
          if (err.error && err.error.msg) {
            this.presentToast(err.error.msg);
          } else {
            this.presentToast('Error al actualizar el grupo multimedia');
          }
        }
      });
    } else {
      this.grupoService.createGrupoMultimedia(grupoData).subscribe({
        next: (resp) => {
          loading.dismiss();
          if (resp.Ok) {
            this.presentToast('Grupo multimedia creado correctamente');
            this.router.navigate(['/grupo-multimedia']);
          } else {
            this.presentToast('Error al crear el grupo multimedia');
          }
        },
        error: (err) => {
          loading.dismiss();
          console.error(err);
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