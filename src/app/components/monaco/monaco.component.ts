import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GetDocumentMetaResponse } from 'src/app/objects/GetDocumentMetaResponse';
import { DocumentService } from '../home/document-service/document.service';

/**
 * Wrapper component for the editor. This handles some of the authentication.
 */
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

  isPasswordWrong: boolean = false;

  isDocumentFound: boolean = true;

  isOtherError: boolean = false;

  constructor(private documentService: DocumentService,
              private route: ActivatedRoute,
              private router: Router) {                 
                this.getMetadata();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    console.log("DESTROY");
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
    this.isPasswordWrong = false;
    this.isOtherError = false;
    this.documentPassword = this.documentForm.value.documentPassword;
    this.documentService.openDocument(this.documentId, this.documentForm.value.documentPassword).subscribe(
      response => {
          this.isDocumentAuthenticated = true;
      },
      (err: HttpErrorResponse) => {
        if (err.status == 401) {
          // Password wrong
          this.isPasswordWrong = true;
        } else if (err.status == 404) {
          this.isOtherError = true;
        }
      }
    );
  }

}
