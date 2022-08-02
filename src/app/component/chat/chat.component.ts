import { Component, ElementRef, OnDestroy, ViewChild, Inject } from "@angular/core"
import { Subscription } from "rxjs"
import { Room } from "./room"
import { Message } from "./message"
import { AngularFireDatabase } from "@angular/fire/compat/database"
import { AuthService } from "../../service/auth/auth.service"
import { AngularFireAuth } from "@angular/fire/compat/auth"
import { AngularFirestore  } from '@angular/fire/compat/firestore'
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';
// import { ZoomMtg } from '@zoomus/websdk';


// ZoomMtg.preLoadWasm();
// ZoomMtg.prepareWebSDK();
// // loads language files, also passes any error messages to the ui
// ZoomMtg.i18n.load('en-US');
// ZoomMtg.i18n.reload('en-US');

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.sass"]
})
export class ChatComponent implements OnDestroy {
  @ViewChild("messagesDiv") messagesDiv: ElementRef | undefined

  roomRef: any
  connected = false
  disableInputs = false
  room: Room | undefined
  text: string | undefined
  subscription: Subscription | undefined
  name: string | ''
  roomId: string | undefined
  isMeeting: any | false

  // zoom environment
  api_key: any
  api_secret: any
  meeting_number: any
  role: Number | undefined
  leave_url: any
  user_name: any
  user_email: any
  password: any
  registrant_token: any

  client = ZoomMtgEmbedded.createClient();

  constructor(public db: AngularFireDatabase, private afAuth: AngularFireAuth, private afs: AngularFirestore, private authService: AuthService, public httpClient: HttpClient, @Inject(DOCUMENT) private document: object) {
    this.api_key = 'CCcaQ6mRTbG7dx0uJaR_jQ'
    this.api_secret = 'gkVoVT8faX9nuFvghaEGtboXrHiUSRhVD9jp'
    this.role = 0
    this.leave_url = 'http://localhost:4200/profile'
    this.user_name = 'ANGULAR'
    this.password = ''
    this.registrant_token = ''
    this.user_email = ''
    this.meeting_number = ''
    this.name = ''
  }

  ngOnInit() {
    const myForm = <HTMLElement>document.getElementById('meetingSDKElement')
    myForm.style.position = 'fixed'
    myForm.style.zIndex = '10000'
    myForm.style.top = '60px'
    myForm.style.left = '60px'

    this.client.init({
      debug: true,
      zoomAppRoot: myForm,
      language: 'en-US',
      customize: {
        meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
        toolbar: {
          buttons: [
            {
              text: 'End Meeting',
              className: 'end-meeting',
              onClick: () => {
                this.client.leaveMeeting();
              }
            }
          ]
        }
      }
    });

    this.getChattingUserList()
  }

  getChattingUserList() {
    console.log("here?")
    this.afs.collection("chattingUsers").valueChanges().subscribe((res: any) => {
      res.map((user: any) => {
        console.log(user)
        if(user.roomId == this.roomId && user.meeting_number) {
          this.isMeeting = true
          this.meeting_number = user.meeting_number
          this.password = user.password
        }
      })
    })
  }

  getSignature() {
    console.log("meetingID", this.meeting_number);
    this.httpClient.post('http://localhost:4000/api/signature', {
      api_key: this.api_key,
      api_key_secret: this.api_secret,
	    meetingNumber: this.meeting_number,
	    role: this.role
    }).toPromise().then((data: any) => {
      if(data.signature) {
        this.startMeeting(data.signature)
      } else {
        console.log(data)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  onJoinMeeting() {
    this.getSignature()
  }

  // startMeeting(signature: any) {        
  //       const myForm = <HTMLElement>document.getElementById('zmmtg-root');
  //       myForm.style.display = 'block'
  //       myForm.style.zIndex = '10000'
    
  //       ZoomMtg.init({
  //         debug: true,
  //         leaveUrl: this.leave_url,
  //         isSupportAV: true,
  //         isSupportChat: true,
  //         sharingMode: 'both',
  //         screenShare: true,
  //         videoHeader: true,
  //         success: (success:any) => {
  //           console.log(success)
  //           ZoomMtg.join({
  //             signature: signature,
  //             meetingNumber: this.meeting_number,
  //             userName: this.name,
  //             apiKey: this.api_key,
  //             userEmail: this.user_email,
  //             passWord: this.password,
  //             tk: this.registrant_token,
  //             success: (success:any) => {
  //               console.log(success)
  //             },
  //             error: (error:any) => {
  //               console.log(error)
  //             }
  //           })
  //         },
  //         error: (error:any) => {
  //           console.log(error)
  //         }
  //       })
  //     }

  startMeeting(signature: any) {
    this.client.join({
    	apiKey: this.api_key,
    	signature: signature,
    	meetingNumber: this.meeting_number,
    	password: this.password,
    	userName: this.name,
      userEmail: this.user_email,
      tk: this.registrant_token
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  async connect(roomId: string) {
    if (roomId) {
      let isSave = false
      this.roomId = roomId
      this.roomRef = this.db.object<Room>(roomId as string)
      this.subscription = this.roomRef.valueChanges().subscribe((f: any) => {
        if (!f) {
          this.roomRef.set(this.room)
        } else {
          this.room = f
        }
        this.connected = true
      })
      // add user who starts to chat
      this.afs.collection("chattingUsers").doc().set({
        roomId: roomId,
        name: this.authService.getProfileName()
      }, { merge: true });
    }
  }

  async onStartChat() {
    let email = this.authService.userData.email.replace(".", "")
    this.room = new Room(email)

    await this.connect(email as string)
    this.name = this.authService.getProfileName()
    if (this.room) this.room!.messages = []
    this.room!.messages.push(new Message(this.name).sendStart())
    this.roomRef.update(this.room)
    setTimeout(() => this.scrollToBottom(), 1)
  }

  onTextChat() {
    if (this.text == undefined) return
    this.name = this.authService.getProfileName()
    this.room!.messages.push(new Message(this.name).sendText(this.text as string))
    this.roomRef.update(this.room)
    setTimeout(() => this.scrollToBottom(), 1)
    this.text = undefined
  }

  async onFinishChat() {
    this.name = this.authService.getProfileName()
    this.room!.messages.push(new Message(this.name).sendFinish())
    this.roomRef.update(this.room)
    setTimeout(() => this.scrollToBottom(), 1)
    this.subscription = undefined
    let deleteId = null
    // remove user who finishs to chat
    const itemsCollection = this.afs.collection('chattingUsers', ref => ref.where('roomId', '==', this.roomId));
    const snapshot = itemsCollection.get()
    snapshot.subscribe(doc => {
      doc.forEach(data => {
        data.ref.delete()
      })
    })
  }

  scrollToBottom() {
    const div = this.messagesDiv!.nativeElement;
    div.scrollTop = div.scrollHeight - div.clientHeight;
  }

}
