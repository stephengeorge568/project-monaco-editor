import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentService } from './document-service/document.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  documentForm = new FormGroup({
    documentId: new FormControl(''),
  });

  constructor(private documentService: DocumentService, private router: Router) { }

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

      // this.documentService.openDocument(this.documentForm.value.documentId, this.documentForm.value.documentPassword).subscribe(
      //   response => {
      //       // Document was successfully authenticated and opened
      //       this.router.navigate(['/document/' + this.documentForm.value.documentId]);
      //   },
      //   (err: HttpErrorResponse) => {
      //     if (err.status == 401) {
      //       // Password wrong
      //     } else if (err.status == 404) {
      //       // Document not in DB or filesystem
      //     }
      //   }
      // );
  }

}
