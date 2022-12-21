import { Component, Inject, Input, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

/**
 * Component for displaying newly created document authentication information.
 */
@Component({
  selector: 'app-document-info',
  templateUrl: './document-info.component.html',
  styleUrls: ['./document-info.component.css']
})
export class DocumentInfoComponent implements OnInit {

  id: number;
  password: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.id = data.id;
    this.password = data.password;
  }

  ngOnInit(): void {
  }

}
