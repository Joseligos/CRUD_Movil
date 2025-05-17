import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Heroe } from 'src/app/interfaces/heroes.interface';
import { HeroesBDService } from 'src/app/services/heroes-bd.service';
import { HeroesListComponent } from 'src/app/components/heroes-list/heroes-list.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.page.html',
  styleUrls: ['./heroes.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    HeroesListComponent,
  ]
})
export class HeroesPage implements OnInit {

  heroes: Heroe[] = [];

  constructor(
    private bdHeroes: HeroesBDService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Detectar cambio de navegación y verificar queryParams
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const recargar = this.route.snapshot.queryParamMap.get('recargar');
        if (recargar === 'true') {
          this.recargarHeroes('');
        }
      });

    this.cargarHeroes();
  }

  async cargarHeroes() {
    await this.bdHeroes.getHeroes().toPromise().then((data: any) => {
      this.heroes = data.resp;
      console.log("MISHEROES", this.heroes);
    });
  }

  async recargarHeroes(id: string) {
    await this.bdHeroes.getHeroes().toPromise().then((data: any) => {
      this.heroes = data.resp;
      console.log('MISHEROES', this.heroes);
    });

    // Limpiar los queryParams para evitar recargas innecesarias
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: 'merge',
    });
  }

  ionViewWillEnter() {
    this.recargarHeroes('');
  }
}
