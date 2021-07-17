import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from "@auth0/angular-jwt";
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';




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
import {MatMenuModule} from '@angular/material/menu';
import { MinuteSecondsPipe } from './pipes/minsToNormal-pipe';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { CommentSectionComponent } from './components/comment-section/comment-section.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { CastToLogPipe } from './pipes/cast-to-log.pipe';
import { CastToRecordingPipe } from './pipes/cast-to-recording.pipe';
import { CastToPostPipe } from './pipes/cast-to-post.pipe';
import { ExplorePreComponent } from './components/explore-pre/explore-pre.component';
import { SearchExploreComponent } from './components/search-explore/search-explore.component';
import { ExploreGenreCellComponent } from './components/explore-genre-cell/explore-genre-cell.component';
import { ExploreContentTypeCellComponent } from './components/explore-content-type-cell/explore-content-type-cell.component';
import { ExploreListComponent } from './components/explore-list/explore-list.component';
import { ExploreProfileItemComponent } from './components/explore-profile-item/explore-profile-item.component';
import { ExploreContentItemComponent } from './components/explore-content-item/explore-content-item.component';
import { ExplorePreListComponent } from './components/explore-pre-list/explore-pre-list.component';
import { CastToUsersPipe } from './pipes/cast-to-user.pipe';
import { CastToGenrePipe } from './pipes/cast-to-genre.pipe';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileImgComponent } from './componenets/profile-img/profile-img.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MessagesMainComponent } from './components/messages-main/messages-main.component';
import { MessagesRouterComponent } from './components/messages-router/messages-router.component';
import { MgroupInfoComponent } from './components/mgroup-info/mgroup-info.component';
import { GroupInfoComponent } from './components/group-info/group-info.component';
import { NewGroupComponent } from './components/new-group/new-group.component';
import { ConversationPreviewComponent } from './components/conversation-preview/conversation-preview.component';
import { MessageUnitComponent } from './components/message-unit/message-unit.component';
import { MetronomeComponent } from './components/metronome/metronome.component';
import { FlexModule } from '@angular/flex-layout';
import {MatTabsModule} from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CastToInstrumentPipe } from './pipes/cast-to-instrument.pipe';














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
    MinuteSecondsPipe,
    CommentSectionComponent,
    CastToLogPipe,
    CastToRecordingPipe,
    CastToPostPipe,
    ExplorePreComponent,
    SearchExploreComponent,
    ExploreGenreCellComponent,
    ExploreContentTypeCellComponent,
    ExploreListComponent,
    ExploreProfileItemComponent,
    ExploreContentItemComponent,
    ExplorePreListComponent,
    CastToUsersPipe,
    CastToGenrePipe,
    CastToInstrumentPipe,
    LeftSidebarComponent,
    ProfileComponent,
    ProfileImgComponent,
    MessagesMainComponent,
    MessagesRouterComponent,
    MgroupInfoComponent,
    GroupInfoComponent,
    NewGroupComponent,
    ConversationPreviewComponent,
    MessageUnitComponent,
    MetronomeComponent
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
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    FormsModule,
    FlexModule,
    MatTabsModule,
    MatGridListModule,
    MatDividerModule,
    TextFieldModule,
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
