import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtModule, JwtModuleOptions } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutes } from './app.routes';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { NavigationComponent } from './navigation/navigation.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { JourneysComponent } from './journeys/journeys.component';
import { JourneyFormComponent } from './journey-form/journey-form.component';
import { JourneyComponent } from './journey/journey.component';
import { HttpRequestInterceptor } from './http-request.interceptor';
import { CheckPointComponent } from './check-point/check-point.component';

const JWT_Module_Options: JwtModuleOptions = {
  config: {
      tokenGetter: localStorage.getItem("token")?.toString
  }
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ErrorPageComponent,
    NavigationComponent,
    RegisterComponent,
    LoginComponent,
    JourneysComponent,
    JourneyFormComponent,
    JourneyComponent,
    RegisterComponent,
    CheckPointComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(AppRoutes),
    JwtModule.forRoot(JWT_Module_Options)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
