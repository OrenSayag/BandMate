import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankComponent } from './components/bank/bank.component';
import { ExploreListComponent } from './components/explore-list/explore-list.component';
import { ExplorePreListComponent } from './components/explore-pre-list/explore-pre-list.component';
import { ExplorePreComponent } from './components/explore-pre/explore-pre.component';
import { ExploreComponent } from './components/explore/explore.component';
import { FeedComponent } from './components/feed/feed.component';
import { LoginComponent } from './components/login/login.component';
import { LogsComponent } from './components/logs/logs.component';
import { MainComponent } from './components/main/main.component';
import { RegisterComponent } from './components/register/register.component';
import { SearchExploreComponent } from './components/search-explore/search-explore.component';
import { TokenBodyGuardGuard } from './guards/token.guard';

const routes: Routes = [
  {path:"register", pathMatch: "full", component:RegisterComponent},
  {path:"login", pathMatch: "full", component:LoginComponent},
  {path:"", component:MainComponent, canActivate: [TokenBodyGuardGuard], 
  children:[
    {path:"logs", component:LogsComponent},
    {path:"bank", component:BankComponent},
    {path:"feed", component:FeedComponent},
    {path:"explore", component:ExploreComponent,
    children:[
      {path:"list", component:ExploreListComponent},
      {path:"preList", component:ExplorePreListComponent},
      {path:"search", component:SearchExploreComponent},
      {path:"", component:ExplorePreComponent, pathMatch:"full"},
    ]
  },
    {path:"", pathMatch:"full" ,redirectTo:"logs"},
  ]
},
// {path:"**", component:LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
