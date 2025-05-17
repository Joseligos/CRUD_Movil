import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonSpinner, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/angular/standalone';
import { Heroe } from 'src/app/interfaces/heroes.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroesBDService } from 'src/app/services/heroes-bd.service';
import { ToastController, AlertController } from '@ionic/angular';
import { HeroeEditComponent } from 'src/app/components/heroe-edit/heroe-edit.component';


@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.page.html',
  styleUrls: ['./heroe.page.scss'],
  standalone: true,  imports: [
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    CommonModule,
    FormsModule,
    HeroeEditComponent
  ]
})
export class HeroePage implements OnInit {
  id!: string;

  heroe: Heroe = {
    _id: '',
    nombre: '',
    bio: '',
    img: '',
    aparicion: '',
    casa: '',
  };

  accion!: string;
  //visualizar
  //insertar
  //actualizar


  constructor(
    private activatedRoute: ActivatedRoute,
    private bd: HeroesBDService,

    //private router: Router,
    //private toastController: ToastController,
    //private alertController: AlertController
    ) {

    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
      this.accion = params['accion'];

      console.log('IDHEROE', this.id, 'ACCION', this.accion);

      if (this.id != '') {
        this.cargarUnHeroe();
      }

    });

  }

  ngOnInit() {
  }
  async cargarUnHeroe() {
    try {
      console.log('Loading hero data for ID:', this.id);
      const data: any = await this.bd.getUnHeroe(this.id).toPromise();
      
      if (data && data.resp) {
        this.heroe = data.resp;
        console.log("Hero loaded successfully:", this.heroe);
      } else {
        console.error("Error loading hero data:", data);
      }
    } catch (error) {
      console.error("Error loading hero:", error);
    }
  }


}
