import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StringChangeRequest } from 'src/app/objects/StringChangeRequest';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from 'src/app/objects/GlobalConstants';
import { Queue } from 'src/app/objects/Queue';
import { Document } from 'src/app/objects/Document';
import { MonacoRange } from 'src/app/objects/MonacoRange';
import { OperationalTransformationService } from './ot/operational-transformation.service';
import { Component, OnInit } from '@angular/core';
import { of, pipe } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { isDevMode } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EditorService {

    // Backend server address
    serverIP: string;

    // identity of the client - currently IP
    clientIdentity: number;

    // pending change queue to send to server
    pendingChangeQueue: Queue<StringChangeRequest>;

    // TODO gotta be better/more proper way to do this. this outputs event on init when i dont want it to.
    stringChangeRequestSubject: BehaviorSubject<StringChangeRequest> = new BehaviorSubject(new StringChangeRequest("", "", -1, new MonacoRange(-1, -1, -1, -1), -1, -1 , -1, ""));

    /* ----------------- FLAGS ----------------- */
    // flag to halt sending of change requests until response arrives from earlier response
    isAwaitingChangeResponse: boolean;

    // flag to halt displaying editor until server responds with identity id
    isAwaitingIdentityResponse: boolean;

    // flag to halt displaying editor until server responds with model
    isAwaitingModelResponse: boolean;

    // flag to halt displaying editor until server responds with revId
    isAwaitingRevIdResponse: boolean;

    constructor(private http: HttpClient, private otService: OperationalTransformationService) {

        this.serverIP = GlobalConstants.publicServerAddress;

        this.isAwaitingChangeResponse = false;
        this.isAwaitingIdentityResponse = true;
        this.isAwaitingModelResponse = true;
        this.isAwaitingRevIdResponse = true;

        this.pendingChangeQueue = new Queue();
        this.clientIdentity = -1;

        this.cacheIdentity();
        // this.cacheRevId();
    }

    /**
     * Gets identity value from server
     */
    public cacheIdentity(): void {
        this.http.get<number>(this.serverIP + "/api/ot/identity").subscribe(response => {
            this.clientIdentity = response;
            console.log(`Identity: ${this.clientIdentity}`);
            this.isAwaitingIdentityResponse = false;
        },
        err => {
            console.log("Get identity has failed: " + err);
        });
    }

    public cacheModel(id: number): Observable<string> {
        return this.http.get(this.serverIP + "/api/ot/model/" + id, {responseType: 'text'}).pipe(tap(response => {
            this.isAwaitingModelResponse = false;
        },
        err => {
            console.log("Get model has failed: " + err);
        }));
    }

    public getDocument(id: number, password: string): Observable<Document> {
        return this.http.get<Document>(this.serverIP + "/api/document/" + id + "?password=" + password).pipe(tap(response => {
            
        },
        err => {
            console.log("Get document has failed: " + err);
        }));
    }

    public cacheRevId(id: number): void {
        this.http.get<number>(this.serverIP + "/api/ot/revId/" + id).subscribe(response => {
            this.otService.revID = response
            this.isAwaitingRevIdResponse = false;
        },
        err => {
            console.log("Get model has failed: " + err);
        });
    }

    public sendOperation(request: StringChangeRequest | undefined): void {
        if (request != undefined) {
            this.isAwaitingChangeResponse = true;
            //request.revID = this.otService.revID;
            this.http.post<number>(this.serverIP + "/api/ot/change", request).subscribe(response => {
                this.otService.revID = response;
                this.isAwaitingChangeResponse = false;
                this.sendNextChangeRequest();
            },
            err => {
                console.log("Send operation has failed: " + err);
            });
        }
    }

    public insertChangeIntoQueue(request: StringChangeRequest): void {
        if (!this.isAwaitingChangeResponse) {
            this.sendOperation(request);
        } else this.pendingChangeQueue.enqueue(request);
        }

        public sendNextChangeRequest(): void {
        if (!this.pendingChangeQueue.isEmpty()) {
            this.sendOperation(this.pendingChangeQueue.dequeue());
        }
    }

}
