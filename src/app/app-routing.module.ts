import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent, MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { MonacoComponent } from './components/monaco/monaco.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WidgetComponent } from './components/widget/widget.component';

const routes: Routes = [
  // { path: '', redirectTo: 'monaco', pathMatch: 'full' },
  // { path: 'monaco/editor', component: EditorComponent, pathMatch: 'full' },
  // { path: 'monaco', component: MonacoComponent, pathMatch: 'full' },
  // { path: '**', component: MonacoComponent }
  // { path: '**', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'document/:id', component: MonacoComponent },
  {path: 'test', component: WidgetComponent},
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, { useHash: false }),
    CommonModule
  ]
})
export class AppRoutingModule {
  
 }
