import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GetDocumentMetaResponse } from 'src/app/objects/GetDocumentMetaResponse';
import { DocumentService } from '../home/document-service/document.service';

@Component({
  selector: 'app-monaco',
  templateUrl: './monaco.component.html',
  styleUrls: ['./monaco.component.css']
})
export class MonacoComponent implements OnInit {

  documentForm = new FormGroup({
    documentPassword: new FormControl(''),
  });

  isDocumentAuthenticated: boolean = false;

  documentId: number = -1;
  documentPassword: string = '';
  documentMetadata?: GetDocumentMetaResponse;

  isDocumentFound: boolean = false;

  constructor(private documentService: DocumentService,
              private route: ActivatedRoute,
              private router: Router) {    
                this.getMetadata();
  }

  ngOnInit(): void {
  }

  getMetadata(): void {
    let idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.documentId = Number(idParam);
        this.documentService.getDocumentMetaData(this.documentId).subscribe(
        response => {
          this.isDocumentFound = true;
          this.documentMetadata = response;
        }, 
        (err: HttpErrorResponse) => {
          this.isDocumentFound = false;
        }
      );
    }
    else {
        // Document id is not valid in url.
        this.isDocumentFound = false;
        // this.router.navigate(['/home']);
    }
  }

  authenticate(): void {
        this.documentService.openDocument(this.documentId, this.documentForm.value.documentPassword).subscribe(
        response => {
            this.isDocumentAuthenticated = true;
        },
        (err: HttpErrorResponse) => {
          if (err.status == 401) {
            // Password wrong
          } else if (err.status == 404) {
            // Document not in DB or filesystem
          }
        }
      );
  }

}
