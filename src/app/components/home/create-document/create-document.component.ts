import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DocumentInfoComponent } from '../../document-info/document-info.component';
import { DocumentService } from '../document-service/document.service';

/**
 * Component that provides functionality to create document and its logic.
 */
@Component({
  selector: 'app-create-document',
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.css']
})
export class CreateDocumentComponent implements OnInit {
  
  errorResponse: boolean = false;

  awaitingCreateResponse: boolean = false;

  // TODO unnecessary. Just reset form on dialog close
  lastCreatedId?: number;
  lastCreatedPassword?: string;

  createDocumentForm = new FormGroup({
    documentName: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z0-9_-]*$')]),
    documentType: new FormControl(''),
    documentPassword: new FormControl(''),
  });

  constructor(private documentService: DocumentService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onCreateSubmit() {
    this.errorResponse = false;
    this.awaitingCreateResponse = true;
    this.documentService.createDocument(this.createDocumentForm.value.documentPassword, 
                                        this.createDocumentForm.value.documentName, 
                                        this.createDocumentForm.value.documentType).subscribe(
      response => {
        this.awaitingCreateResponse = false;
        this.lastCreatedId = response;
        this.lastCreatedPassword = this.createDocumentForm.value.documentPassword;
        this.createDocumentForm.reset();
        let dialogRef = this.dialog.open(DocumentInfoComponent, {
          data: {
            id: this.lastCreatedId,
            password: this.lastCreatedPassword
          },
        });
      }, 
      (err: HttpErrorResponse) => {
        this.awaitingCreateResponse = false;
        this.errorResponse = true;
      }
    );
}

}
