import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// Add these imports and providers to your existing app.config.ts
import { FormsModule } from '@angular/forms';
import { importProvidersFrom } from '@angular/core';
import { AdminAuthGuard } from './core/services/AdminDashBoard/admin-auth.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(FormsModule), // Needed for admin login form
    AdminAuthGuard // Add the guard to providers
  ]
};
