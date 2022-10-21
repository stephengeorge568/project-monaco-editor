import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent, MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { MonacoComponent } from './components/monaco/monaco.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  // { path: '', redirectTo: 'monaco', pathMatch: 'full' },
  // { path: 'monaco/editor', component: EditorComponent, pathMatch: 'full' },
  // { path: 'monaco', component: MonacoComponent, pathMatch: 'full' },
  // { path: '**', component: MonacoComponent }
  { path: '**', component: HomeComponent }
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
