import { Injectable } from '@angular/core';
import { MultimediaHeroeService } from './multimediaheroe.service';
import { HeroesBDService } from './heroes-bd.service';
import { MultimediaService } from './multimedia.service';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataLoaderService {
  private heroesSubject = new BehaviorSubject<any[]>([]);
  private multimediasSubject = new BehaviorSubject<any[]>([]);
  private multimediaHeroesSubject = new BehaviorSubject<any[]>([]);

  // Exponer observables públicos
  public heroes$ = this.heroesSubject.asObservable();
  public multimedias$ = this.multimediasSubject.asObservable();
  public multimediaHeroes$ = this.multimediaHeroesSubject.asObservable();

  // Estado de carga
  private loadingState = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingState.asObservable();

  constructor(
    private multimediaHeroeService: MultimediaHeroeService,
    private heroesService: HeroesBDService,
    private multimediaService: MultimediaService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    console.log('DataLoaderService initialized');
  }

  // Métodos para obtener datos actuales
  get heroes(): any[] {
    return this.heroesSubject.value;
  }

  get multimedias(): any[] {
    return this.multimediasSubject.value;
  }

  get multimediaHeroes(): any[] {
    return this.multimediaHeroesSubject.value;
  }

  // Método principal para cargar todos los datos secuencialmente
  async loadAllData(showLoader: boolean = true): Promise<void> {
    this.loadingState.next(true);

    let loader: HTMLIonLoadingElement | null = null;
    
    try {
      if (showLoader) {
        loader = await this.loadingCtrl.create({
          message: 'Cargando datos...',
          spinner: 'crescent'
        });
        await loader.present();
      }

      // Cargar héroes
      await this.loadHeroes();
      
      // Cargar multimedias
      await this.loadMultimedias();
      
      // Cargar relaciones multimedia-héroe
      await this.loadMultimediaHeroes();

      if (loader) {
        await loader.dismiss();
      }
      
      this.loadingState.next(false);
    } catch (error) {
      console.error('Error loading data:', error);
      this.presentToast('Error al cargar los datos');
      if (loader) {
        await loader.dismiss();
      }
      this.loadingState.next(false);
    }
  }

  // Método para cargar héroes
  private async loadHeroes(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.heroesService.getHeroes().pipe(
        tap((resp: any) => {
          if (resp && resp.Ok) {
            const heroes = resp.resp || [];
            this.heroesSubject.next(heroes);
            console.log(`Loaded ${heroes.length} heroes`);
          } else {
            console.error('Error loading heroes:', resp);
            reject('Error loading heroes');
          }
        }),        catchError(error => {
          console.error('Error in loadHeroes:', error);
          reject(error);
          return of(null);
        })
      ).subscribe({
        next: () => resolve(),
        error: (err: any) => reject(err)
      });
    });
  }

  // Método para cargar multimedias
  private async loadMultimedias(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.multimediaService.getMultimedias().pipe(
        tap((resp: any) => {
          if (resp && resp.Ok) {
            const multimedias = resp.resp || [];
            this.multimediasSubject.next(multimedias);
            console.log(`Loaded ${multimedias.length} multimedias`);
          } else {
            console.error('Error loading multimedias:', resp);
            reject('Error loading multimedias');
          }
        }),        catchError(error => {
          console.error('Error in loadMultimedias:', error);
          reject(error);
          return of(null);
        })
      ).subscribe({
        next: () => resolve(),
        error: (err: any) => reject(err)
      });
    });
  }
  // Método para cargar relaciones multimedia-héroe
  private async loadMultimediaHeroes(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Variables para controlar el estado de la promesa
      let isResolved = false;
      let isRejected = false;
      
      const safeResolve = () => {
        if (!isResolved && !isRejected) {
          isResolved = true;
          resolve();
        }
      };
      
      const safeReject = (error: any) => {
        if (!isResolved && !isRejected) {
          isRejected = true;
          reject(error);
        }
      };
      
      // Añadir un pequeño retraso para asegurar que el backend está listo
      const timeoutId = setTimeout(() => {
        this.multimediaHeroeService.getMultimediaHeroe().pipe(
          tap((resp: any) => {
            if (resp && resp.Ok) {
              const multimediaHeroes = resp.resp || [];
              this.multimediaHeroesSubject.next(multimediaHeroes);
              console.log(`Loaded ${multimediaHeroes.length} multimedia-hero relationships`);
              
              if (multimediaHeroes.length > 0) {
                console.log('First multimedia-hero relationship:', multimediaHeroes[0]);
              }
            } else {
              console.error('Error loading multimedia-heroes:', resp);
              safeReject('Error loading multimedia-heroes');
            }
          }),          catchError(error => {
            console.error('Error in loadMultimediaHeroes:', error);
            safeReject(error);
            return of(null);
          })
        ).subscribe({
          next: () => safeResolve(),
          error: (err: any) => safeReject(err),
          complete: () => safeResolve()
        });
      }, 500); // 500ms de retraso
      
      // Agregar un timeout general para evitar que la promesa quede colgada indefinidamente
      const failsafeId = setTimeout(() => {
        if (!isResolved && !isRejected) {
          console.warn('MultimediaHeroes load timed out after 10 seconds');
          // Intentar resolver con datos vacíos en lugar de rechazar
          this.multimediaHeroesSubject.next([]);
          safeResolve();
        }
      }, 10000); // 10 segundos de timeout máximo
      
      // Cleanup function para eliminar timeouts si la promesa se resuelve/rechaza
      const cleanup = () => {
        clearTimeout(timeoutId);
        clearTimeout(failsafeId);
      };
      
      // Asegurarnos de limpiar los timeouts
      Promise.resolve().then(() => {
        return new Promise(r => {
          const checkInterval = setInterval(() => {
            if (isResolved || isRejected) {
              clearInterval(checkInterval);
              cleanup();
              r(null);
            }
          }, 100);
        });
      });
    });
  }

  // Método auxiliar para presentar un toast
  private async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}
