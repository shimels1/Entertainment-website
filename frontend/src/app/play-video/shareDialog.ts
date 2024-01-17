import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { OtherService } from '../services/other.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-share-dialog',
  template: `
    <form class="comment-form" fxLayout="column" #f="ngForm" 
    style="width:100%;height:100%;">
    <h1 mat-dialog-title>Report  video</h1>
    <div fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="15px"
     style="width:100%;height:100%;">
    <mat-form-field style="width:100%;height:100%;" > 
    <textarea style="width:100%;height:100px" type="name" ngModel minlength='6'
     matInput #message="ngModel" placeholder="wright your message here" name="message" required></textarea>
    <mat-error *ngIf="!message.value">Message required. </mat-error>
    <mat-error *ngIf="!message.valid && message.value">Message is to short. </mat-error>
</mat-form-field>

    </div>
    <div mat-dialog-actions >
    <button mat-raised-button (click)="onNoClick()">Cancel</button>
    <button type="submit" mat-raised-button color="primary" [disabled]="!f.valid"
     (click)="send(f)">Send</button>
  </div>
</form>

`
  ,
})
export class ShareDialogItems {

  constructor(
    public dialogRef: MatDialogRef<ShareDialogItems>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private otherServices: OtherService,
    private snackBar: MatSnackBar, private activatedRouter: ActivatedRoute) { }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  changePosition() {
    this.dialogRef.updatePosition({ top: '555px', left: '50px' });
  }

  message$ = "";
  send(form: NgForm) {

    var vid;
    this.activatedRouter.queryParamMap.subscribe(param => {
      vid = param['params'].id;
    });

    const uploadData = new FormData();
    uploadData.append('name', 'video reported vid = ' + vid);
    uploadData.append('email', 'videoreport@gmail.com');
    uploadData.append('message', form.value.message);
    this.otherServices.sendMessage(uploadData).subscribe((res: any) => {
      if (res['message']) {
        this.message$ = 'message sent success, Thank you.';
        form.resetForm();
        this.onNoClick();
        this.openSnackBar('reported success, thank you.', '');
      }
    });
  }
}

export interface DialogData {
  animal: string;
  name: string;
}