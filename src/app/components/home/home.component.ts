import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DocumentInfoComponent } from '../document-info/document-info.component';
import { DocumentService } from './document-service/document.service';

/**
 * Home component. Landing page.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  awaitingCreateResponse: boolean = false;

  lastCreatedId?: number;
  lastCreatedPassword?: string;

  documentForm = new FormGroup({
    documentId: new FormControl(''),
  });

  createDocumentForm = new FormGroup({
    documentName: new FormControl(''),
    documentType: new FormControl(''),
    documentPassword: new FormControl(''),
  });

  constructor(private documentService: DocumentService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onSubmit() {

      this.documentService.getDocumentMetaData(this.documentForm.value.documentId).subscribe(
        response => {
          this.router.navigate(['/document/' + this.documentForm.value.documentId]);
        }, 
        (err: HttpErrorResponse) => {
        
        }
      );
  }

  onCreateSubmit() {
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
      }
    );
}

}
