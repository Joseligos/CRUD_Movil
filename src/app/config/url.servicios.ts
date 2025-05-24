export const URL_HEROES = "https://rest-sorella-production.up.railway.app/api";
// Asegúrate de que esto apunte a tu servidor backend local o en producción
export const URL_BACKEND = "https://backendcrudmovil-production.up.railway.app/api";

// Esta función permite determinar la URL base dependiendo del entorno
export function getBackendUrl() {
  // Si estamos en desarrollo local y el servidor backend está funcionando
  try {
    return URL_BACKEND;
  } catch (error) {
    console.warn("Fallback to remote URL due to error:", error);
    return URL_HEROES;
  }
}