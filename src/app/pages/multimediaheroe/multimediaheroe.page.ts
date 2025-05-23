import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultimediaHeroeListComponent } from '../../components/multimediaheroe-list/multimediaheroe-list.component';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonFab } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { DataLoaderService } from '../../services/data-loader.service';

@Component({
  selector: 'app-multimediaheroe',
  templateUrl: './multimediaheroe.page.html',
  styleUrls: ['./multimediaheroe.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    MultimediaHeroeListComponent,
    RouterModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonFab
  ]
})
export class MultimediaHeroePage implements OnInit {

  constructor(private dataLoader: DataLoaderService) {
    addIcons({ add });
  }

  ngOnInit() {
    // Inicializar datos al cargar la página
    this.dataLoader.loadAllData();
  }

}
