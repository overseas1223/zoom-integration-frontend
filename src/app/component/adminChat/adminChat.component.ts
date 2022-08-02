import { Component, ElementRef, OnDestroy, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { Subscription } from "rxjs";
import { Room } from "./room";
import { Message } from "./message";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/compat/database";
import { AuthService } from "../../service/auth/auth.service";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore  } from '@angular/fire/compat/firestore'
import { Observable } from 'rxjs';

@Component({
  selector: "app-admin-chat",
  templateUrl: "./adminChat.component.html",
  styleUrls: ["./adminChat.component.sass"]
})
export class AdminChatComponent implements OnDestroy {
  @ViewChild("messagesDiv") messagesDiv: ElementRef | undefined
  @ViewChild("chatbox") chatboxDiv: ElementRef | undefined

  @Input() roomId: any
  @Input() username: any
  @Output() zoomClicked: EventEmitter<object> = new EventEmitter<object>()

  itemsRef: AngularFireList<any> | undefined
  items: Observable<any[]> | undefined
  roomRef: any
  text: string | undefined
  name: string | undefined
  room: Room | undefined
  subscription: Subscription | undefined
  messages: any | []

  constructor(public db: AngularFireDatabase, private afs: AngularFirestore, private afAuth: AngularFireAuth, private authService: AuthService) {
    
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  ngOnInit() {
    this.onStartChat()
  }

  async connect(roomId: string) {
    if (roomId) {
      this.roomId = roomId
      this.roomRef = this.db.object<Room>(roomId as string)
      this.subscription = this.roomRef.valueChanges().subscribe((f: any) => {
        if (!f) {
          this.roomRef.set(this.room)
        } else {
          this.room = f
          this.messages = f.messages
        }
      })
    }
  }

  async onStartChat() {
    this.room = new Room(this.roomId)
    await this.connect(this.roomId as string)
  }

  onTextChat() {
    if (this.text == undefined) return
    this.name = this.authService.getProfileName()
    this.room!.messages.push(new Message(this.name).sendText(this.text as string))
    this.roomRef.update(this.room)
    setTimeout(() => this.scrollToBottom(), 100)
    this.text = undefined
  }

  scrollToBottom() {
    const div = this.messagesDiv!.nativeElement;
    div.scrollTop = div.scrollHeight - div.clientHeight;
  }

  createMeeting() {
    const user = {
      roomId: this.roomId,
      name: this.username
    }
    this.zoomClicked.emit(user)
  }
}
