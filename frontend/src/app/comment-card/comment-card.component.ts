import { Component, OnInit, Input } from "@angular/core";
import { Comment } from "../model/Comment";
import { CommentService } from "../services/comment.service";
import { UserAuthService } from "../services/userAuth.service";
import { LoginDialog } from "../navigation/header/loginDialog";
import { MatDialog } from "@angular/material";
import { UserService } from "../services/user.service";
import { Customer } from "../model/Customer";

@Component({
  selector: "app-comment-card",
  templateUrl: "./comment-card.component.html",
  styleUrls: ["./comment-card.component.css"],
})
export class CommentCardComponent implements OnInit {
  @Input() comment: Comment;
  like$ = 0;
  $user: Customer;

  constructor(
    private commentService: CommentService,
    public userAuthService: UserAuthService,
    public dialog: MatDialog,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.getLikeCount();
    this.userService.getUser(this.comment.email).subscribe((res) => {
      if (!res["message"]) {
        this.$user = res;
      }
    });
  }

  IsUserLikeThisComment$ = false;
  getLikeCount() {
    this.commentService
      .getLike(this.comment.idcomment, this.userAuthService.getUser().email)
      .subscribe((res) => {
        if (res["like"]) {
          this.like$ = res["like"];
        } else {
          this.like$ = 0;
        }
        if (res["userLike"]) {
          this.IsUserLikeThisComment$ = true;
        } else {
          this.IsUserLikeThisComment$ = false;
        }
      });
  }

  likeComment(c) {
    this.commentService
      .likeComment(c, this.userAuthService.getUser()["email"])
      .subscribe((res) => {
        this.getLikeCount();
      });
  }

  // logon dialog
  LoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialog, {
      panelClass: "my-login-dialog",
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  // end
}
