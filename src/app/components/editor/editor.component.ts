import { Component, OnInit } from '@angular/core';
import * as monaco from 'monaco-editor';
import { NgxEditorModel } from 'ngx-monaco-editor';
import { MonacoRange } from 'src/app/objects/MonacoRange';
import { StringChangeRequest } from 'src/app/objects/StringChangeRequest';
import { EditorService } from './service/editor.service';
import { OperationalTransformationService } from './service/ot/operational-transformation.service';
import { WebsocketService } from './service/websocket-service/websocket.service';
import {MatToolbarModule} from '@angular/material/toolbar';
import { DocumentService } from '../home/document-service/document.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Input } from '@angular/core';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

    // configurations for monaco editor
    editorOptions = {quickSuggestions: false, theme: 'vs-dark'};
    model: NgxEditorModel = {value : '', language: 'java'};
    editor: any;
    @Input() documentId: number = 0;
    @Input() documentPassword: string = '';
    @Input() filename: string = '';
    @Input() filetype: string = '';

    // This subscription manages changes found on the local editor
    localEditorChangeSubscription: any;

    // Flag to detect what changes are programmatic and which are manual and local 
    isProgrammaticChange: boolean;

    isSaveError: boolean = false;

    constructor(private editorService: EditorService, 
                private otService: OperationalTransformationService, 
                private websocketService: WebsocketService,
                private documentService: DocumentService,
                private route: ActivatedRoute,
                private router: Router) { 
        this.isProgrammaticChange = false; 
    }

    ngOnInit(): void {
        this.editorService.cacheRevId(this.documentId);
        this.connectWebsocket();
    }

    onInit(editorInit: monaco.editor.IStandaloneCodeEditor) {
        console.log("OIN INIIT");
        this.editor = editorInit;
        const code: HTMLElement = document.getElementById('editor') as HTMLElement;
        monaco.editor.colorizeElement(code, {tabSize: 4});
        monaco.editor.setTheme('vs-dark');
        this.editor.getModel()?.updateOptions({insertSpaces: false});
        this.editorService.cacheModel(this.documentId).subscribe((response: any) => {
            this.isProgrammaticChange = true;
            
            this.editor.getModel()?.applyEdits([{
                forceMoveMarkers: false,
                range: {
                    startLineNumber: 1,
                    endLineNumber: 1,
                    startColumn: 1,
                    endColumn: 1,
                },
                text: response
                }]);

            this.isProgrammaticChange = false;
        });
        
        this.subscriptions();
    }

    ngOnDestroy(): void {
        this.disconnectWebsocket();
    }

    connectWebsocket(): void {
        this.websocketService.connectWebSocket(this.documentId);
    }

    disconnectWebsocket(): void {
        this.websocketService.disconnectWebSocket();
    }

    subscriptions(): void {
        // This subscription manages incoming changes from other clients
        this.editorService.stringChangeRequestSubject.subscribe((operation: StringChangeRequest) => {
            // TODO change to other method
            if (operation.documentId !== -1) {
                let transformed: StringChangeRequest[] = this.otService.transform(operation);
                for (var request of transformed) {
                    this.otService.insertRequestIntoHistory(request);
                    this.isProgrammaticChange = true;
                    this.editor.getModel()?.applyEdits([{
                        forceMoveMarkers: true,
                        range: {
                            startLineNumber: request.range.startLineNumber,
                            endLineNumber: request.range.endLineNumber,
                            startColumn: request.range.startColumn,
                            endColumn: request.range.endColumn,
                        },
                        text: request.text
                    }]);
                    this.isProgrammaticChange = false;
                }
            } 
            
        }, (err: any) => {
            console.log(err);
        });

        // This subscription manages changes found on the local editor
        this.localEditorChangeSubscription = this.editor.getModel().onDidChangeContent((event: monaco.editor.IModelContentChangedEvent) => { 
            let opRange: monaco.IRange = event.changes[0].range;
            let request: StringChangeRequest = new StringChangeRequest(
                new Date().toISOString(), 
                event.changes[0].text, 
                this.editorService.clientIdentity, 
                new MonacoRange(
                    opRange.endColumn, 
                    opRange.startColumn, 
                    opRange.endLineNumber, 
                    opRange.startLineNumber), 
                this.otService.revID,
                this.documentId,
                0,
                this.documentPassword);

            this.otService.insertRequestIntoHistory(request);
            if (!this.isProgrammaticChange) {
                this.editorService.insertChangeIntoQueue(request);
            if (!this.editorService.isAwaitingChangeResponse) {
                this.editorService.sendNextChangeRequest();
            }
            }
        }); 
    }

    download(): void {
        let filename: string = this.filename + '.' + this.filetype;
        let text: string = this.editor.getModel().getValue();
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
    }

    save(): void {
        this.isSaveError = false;
        this.documentService.saveDocumentToCloud(this.documentPassword, this.documentId).subscribe(
            (response) => {

            }, (err) => {
                this.isSaveError = true;
            });
    }

}
