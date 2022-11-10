import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent, MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { MonacoComponent } from './components/monaco/monaco.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';

const routes: Routes = [
  // { path: '', redirectTo: 'monaco', pathMatch: 'full' },
  // { path: 'monaco/editor', component: EditorComponent, pathMatch: 'full' },
  // { path: 'monaco', component: MonacoComponent, pathMatch: 'full' },
  // { path: '**', component: MonacoComponent }
  // { path: '**', redirectTo: 'home' },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'how-it-works', component: HowItWorksComponent, pathMatch: 'full' },
  { path: 'document/:id', component: MonacoComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    CommonModule
  ]
})
export class AppRoutingModule {
  
 }
