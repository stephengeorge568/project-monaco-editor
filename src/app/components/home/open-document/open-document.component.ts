import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentService } from '../document-service/document.service';

@Component({
  selector: 'app-open-document',
  templateUrl: './open-document.component.html',
  styleUrls: ['./open-document.component.scss']
})
export class OpenDocumentComponent implements OnInit {

  documentForm = new FormGroup({
    documentId: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
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
}

}
