import { Component, ElementRef, OnDestroy, ViewChild, Inject } from "@angular/core"
import { AngularFireDatabase, AngularFireList } from "@angular/fire/compat/database"
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection  } from '@angular/fire/compat/firestore'
import { AuthService } from "../../service/auth/auth.service"
import { AngularFireAuth } from "@angular/fire/compat/auth"
import { Observable } from 'rxjs';
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
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.sass"]
})
export class AdminComponent implements OnDestroy {
  @ViewChild("messagesDiv") messagesDiv: ElementRef | undefined

  itemsRef: AngularFireList<any> | undefined;
  items: Observable<any[]> | undefined;

  chattingUsers: any | []
  userlist: any | undefined
  
  private usersCollection: AngularFirestoreCollection<any> | undefined

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

  constructor(public db: AngularFireDatabase, private afAuth: AngularFireAuth, private afs: AngularFirestore, public authService: AuthService, public httpClient: HttpClient, @Inject(DOCUMENT) private document: object) {
    this.userlist = []
    this.getRooms()

    this.api_key = 'CCcaQ6mRTbG7dx0uJaR_jQ'
    this.api_secret = 'gkVoVT8faX9nuFvghaEGtboXrHiUSRhVD9jp'
    this.role = 1
    this.leave_url = 'http://localhost:4200/admin'
    this.user_name = 'Administrator'
    this.password = ''
    this.registrant_token = ''
    this.user_email = ''
    this.meeting_number = ''
  }

  ngOnInit() {
    const myForm = <HTMLElement>document.getElementById('meetingSDKElementAdmin')
    myForm.style.top = '60px'
    myForm.style.position = 'fixed'
    myForm.style.zIndex = '10000'
    myForm.style.right = '60px'

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
  }

  ngOnDestroy(): void {
    
  }

  getRooms() {
    this.usersCollection = this.afs.collection('chattingUsers')
    this.chattingUsers = this.usersCollection.valueChanges();
    this.chattingUsers.subscribe((res : any) => {
      this.userlist = []
      res.map((data: any) => {
        this.userlist.push(data)
      })
    });
  }

  createMeeting(event: any) {    
    const playload = {
      iss: this.api_key,
      exp: ((new Date()).getTime() + 30000 )
    }

    this.httpClient.post('http://localhost:4000/api/zoomfeature/meetings', {
      playload: playload,
      api_secret: this.api_secret,
      MeetingRequest: {
        topic: 'Support Meeting',
        password: 'superstarno1',
        agenda: 'ZOOM'
      }
    }).toPromise().then((response: any) => {
      if(response) {
        console.log(response);
        this.meeting_number = response.meeting.id;
        this.password = response.meeting.password;
        const user = {
          roomId: event.roomId,
          name: event.name,
          meeting_number: this.meeting_number,
          password: this.password
        }
        this.updateChattingUser(user)
        this.getSignature();
      } else {
        console.log(response);
      }
    }).catch((error) => {
      console.log(error)
    }) 
  }

  updateChattingUser(param: any) {
    this.afs.collection("chattingUsers").get().subscribe(res => {
      res.docs.map(doc => {
        const tmp: any = doc.data()
        const user = {
          id: doc.id,
          roomId: tmp.roomId,
          name: tmp.name
        }
        if(param.roomId == user.roomId && param.name == user.name) {
          this.afs.collection("chattingUsers").doc(user.id).update({
            roomId: param.roomId,
            name: param.name,
            meeting_number: param.meeting_number,
            password: param.password
          })  
        }else{
          console.log("there")
        }
      })
    })
  }

  getSignature() {
    this.httpClient.post('http://localhost:4000/api/signature', {
      api_key: this.api_key,
      api_key_secret: this.api_secret,
	    meetingNumber: this.meeting_number,
	    role: this.role
    }).toPromise().then((data: any) => {
      if(data.signature) {
        console.log(data);
        this.startMeeting(data.signature)
      } else {
        console.log(data)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  // startMeeting(signature: any) {
  //       const myForm = <HTMLElement>document.getElementById('zmmtg-root');
  //       myForm.style.zIndex = '10000'
  //       myForm.style.display = 'block'
    
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
  //             userName: this.user_name,
  //             apiKey: this.api_key,
  //             userEmail: this.user_email,
  //             passWord: this.password,
  //             tk: this.registrant_token,
  //             success: (success:any) => {
  //               console.log(success)
  //             },
  //             error: (error: any) => {
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
    	userName: this.user_name,
      userEmail: this.user_email,
      tk: this.registrant_token
    })
  }
}
