import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from "@auth0/angular-jwt";
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LogsComponent } from './components/logs/logs.component';
import { LogAddFormComponent } from './components/log-add-form/log-add-form.component';
import { LogItemComponent } from './components/log-item/log-item.component';
import { SocialBarComponent } from './components/social-bar/social-bar.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NavBarBtnComponent } from './components/nav-bar-btn/nav-bar-btn.component';
import { NavbarAddBtnComponent } from './components/navbar-add-btn/navbar-add-btn.component';
import { HeaderComponent } from './components/header/header.component';
import { BurgerMenuComponent } from './components/burger-menu/burger-menu.component';
import { ProfileBarComponent } from './components/profile-bar/profile-bar.component';
import { GenreFormBarComponent } from './components/genre-form-bar/genre-form-bar.component';
import { ExploreComponent } from './components/explore/explore.component';
import { ExploreBtnColComponent } from './components/explore-btn-col/explore-btn-col.component';
import { ExploreBtnStackComponent } from './components/explore-btn-stack/explore-btn-stack.component';
import { ExploreBtnComponent } from './components/explore-btn/explore-btn.component';
import { ExploreUserItemComponent } from './components/explore-user-item/explore-user-item.component';
import { FeedComponent } from './components/feed/feed.component';
import { AddPostFormComponent } from './components/add-post-form/add-post-form.component';
import { PostUnitComponent } from './components/post-unit/post-unit.component';
import { BankComponent } from './components/bank/bank.component';
import { RecordingUnitComponent } from './components/recording-unit/recording-unit.component';
import { AddRecordingFormComponent } from './components/add-recording-form/add-recording-form.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { ConversationComponent } from './components/conversation/conversation.component'

// Material
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MainComponent } from './components/main/main.component';
import { AddContentButtonComponent } from './components/add-content-button/add-content-button.component';
import { LogListComponent } from './components/log-list/log-list.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ChooseInstrumentsBarComponent } from './components/choose-instruments-bar/choose-instruments-bar.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ChooseInstrumentsBarDialogComponent } from './components/choose-instruments-bar-dialog/choose-instruments-bar-dialog.component';
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';








export function tokenGetter() {
  return localStorage.getItem("access_token");
}


@NgModule({
  declarations: [
    AppComponent,
    LogsComponent,
    LogAddFormComponent,
    LogItemComponent,
    SocialBarComponent,
    NavBarComponent,
    NavBarBtnComponent,
    NavbarAddBtnComponent,
    HeaderComponent,
    BurgerMenuComponent,
    ProfileBarComponent,
    GenreFormBarComponent,
    ExploreComponent,
    ExploreBtnColComponent,
    ExploreBtnStackComponent,
    ExploreBtnComponent,
    ExploreUserItemComponent,
    FeedComponent,
    AddPostFormComponent,
    PostUnitComponent,
    BankComponent,
    RecordingUnitComponent,
    AddRecordingFormComponent,
    LoginComponent,
    RegisterComponent,
    InboxComponent,
    ConversationComponent,
    MainComponent,
    AddContentButtonComponent,
    LogListComponent,
    ChooseInstrumentsBarComponent,
    ChooseInstrumentsBarDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatListModule,
    MatChipsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost"],
        disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
