import { Injectable, isDevMode } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Observable, of, pipe } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from 'src/app/objects/GlobalConstants';
import { OpenDocumentRequest } from 'src/app/objects/OpenDocumentRequest';
@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  serverIP: string;

  constructor(private http: HttpClient) {
    if (isDevMode()) this.serverIP = GlobalConstants.devServerAddress;
    else this.serverIP = GlobalConstants.publicServerAddress;
  }



  public openDocument(id: number, password: string): Observable<any> {
    let request: OpenDocumentRequest = new OpenDocumentRequest(id, password);
    return this.http.post<any>(this.serverIP + "/api/document/open", request);
  }
  
}
