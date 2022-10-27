import { Injectable, isDevMode } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Observable, of, pipe } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from 'src/app/objects/GlobalConstants';
import { OpenDocumentRequest } from 'src/app/objects/OpenDocumentRequest';
import { GetDocumentMetaResponse } from 'src/app/objects/GetDocumentMetaResponse';
import { CreateDocumentRequest } from 'src/app/objects/CreateDocumentRequest';
@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  serverIP: string;

  idPassMap: Map<number, string>;

  constructor(private http: HttpClient) {
    if (isDevMode()) this.serverIP = GlobalConstants.devServerAddress;
    else this.serverIP = GlobalConstants.publicServerAddress;

    this.idPassMap = new Map();
  }

  public openDocument(id: number, password: string): Observable<any> {
    let request: OpenDocumentRequest = new OpenDocumentRequest(id, password);
    return this.http.post<any>(this.serverIP + "/api/document/open", request);
  }

  public getDocumentMetaData(id: number): Observable<GetDocumentMetaResponse> {
    return this.http.get<GetDocumentMetaResponse>(this.serverIP + "/api/document/meta/" + id);
  }

  public idPassMapPut(id: number, password: string): void {
    if (!this.idPassMap.has(id)) {
      this.idPassMap.set(id, password);
    }
  }

  public createDocument(password: string, name: string, type: string): Observable<number> {
    let request: CreateDocumentRequest = new CreateDocumentRequest(password, name, type);
    return this.http.post<number>(this.serverIP + "/api/document", request);
  }
  
}
