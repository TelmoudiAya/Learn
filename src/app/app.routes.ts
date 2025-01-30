
import { RouterModule, Routes } from '@angular/router';

import { InscritComponent } from './inscrit/inscrit.component'; // Inscription Page
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HomeProfComponent } from './home-prof/home-prof.component';
import { HomeStudComponent } from './home-stud/home-stud.component';
import { ProfilComponent } from './profil/profil.component';
import { CategorieComponent } from './categorie/categorie.component';
import { CommunicateComponent } from './communicate/communicate.component';
import { BlockUserComponent } from './block-user/block-user.component';
import { PaymentsComponent } from './payments/payments.component';
import { ComComponent } from './com/com.component';
import { ProfilpComponent } from './profilp/profilp.component';
import { GestionComponent } from './gestion/gestion.component';
import { MsgComponent } from './msg/msg.component';
import { CoursesComponent } from './courses/courses.component';
import { UploadComponent } from './upload/upload.component';
import { TestsComponent } from './tests/tests.component';
import { AccueilComponent } from './accueil/accueil.component';
import { NgModule } from '@angular/core';
import { ProfilAdminComponent } from './profil-admin/profil-admin.component';
import { VerifComponent } from './verif/verif.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';



export const routes: Routes = [

  // {
  //   path: 'admin',component: AdminLayoutComponent,
  //   children: [
      
  //   ]
  // },

  { path: '', component: HomeComponent },
      { path: 'profil', component: ProfilComponent },
      { path: 'categorie', component: CategorieComponent },
      { path: 'communicate', component: CommunicateComponent },
      { path: 'block-user', component: BlockUserComponent },
      { path: 'payments', component: PaymentsComponent },
      { path: 'profil-admin', component: ProfilAdminComponent },
      { path: 'verif', component: VerifComponent },
  
  
  

  { path: 'home-prof', component: HomeProfComponent },
  { path: 'home-stud', component: HomeStudComponent },

  { path: 'com', component: ComComponent },
  { path: 'profilp', component: ProfilpComponent },
  { path: 'gestion', component: GestionComponent },
  { path: 'msg', component: MsgComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'tests', component: TestsComponent },
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: 'accueil', component: AccueilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'inscrit', component: InscritComponent },
];
