import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { GlobalConstants } from 'src/app/objects/GlobalConstants';
import { StringChangeRequest } from 'src/app/objects/StringChangeRequest';
import { EditorService } from '../editor.service';
import { OperationalTransformationService } from '../ot/operational-transformation.service';
import { isDevMode } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {

    // Backend server address
    serverIP: string;

    // URI to recieve from websocket
    // incomingURI: string = "/broker/string-change-request";
    incomingURI: string = "/broker/";

    // websocket client
    stompClient: any;

    cachedDocumentId: number = -1;

    constructor(private editorService: EditorService, private otService: OperationalTransformationService) {
        if (isDevMode()) {
            this.serverIP = GlobalConstants.devServerAddress;
        } else this.serverIP = GlobalConstants.publicServerAddress;
    }

    public recieveFromWebSocket(request: any) {      
        let obj = JSON.parse(request.body);
        if (obj.identity != this.editorService.clientIdentity) {
            console.log(new StringChangeRequest(obj.timestamp, obj.text, obj.identity, obj.range, obj.revID, obj.revID, obj.setID, ""));
           this.editorService.stringChangeRequestSubject.next(new StringChangeRequest(obj.timestamp, obj.text, obj.identity, obj.range, obj.revID, obj.revID, obj.setID, ""));
        }  
    }

    public connectWebSocket(id: number): void {
        this.cachedDocumentId = id;
        let socket = new SockJS(this.serverIP + '/ws');
        this.stompClient = Stomp.over(socket);
        this.stompClient.debug = GlobalConstants.disableStompLogging;
        const _this = this;
        _this.stompClient.connect({}, function (frame: any) {
            _this.stompClient.subscribe(_this.incomingURI + id, function (event: any) {
                _this.recieveFromWebSocket(event);
            });
        }, this.errorFromWebSocket);
    }

    public disconnectWebSocket() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Web socket connection has been terminated.");
    }

    public errorFromWebSocket(error: any) {
        console.log("APISocket error: " + error);
        setTimeout(() => {
            console.log("Attemping to reconnect to the server via web socket.");
            this.connectWebSocket(this.cachedDocumentId);
        }, 5000);
    }
}
