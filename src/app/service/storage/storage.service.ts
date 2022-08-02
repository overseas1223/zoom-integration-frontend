import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AlertService } from '../alert/alert.service';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    location = "profile/"

    options = {
        autoClose: true,
        fade: false,
        keepAfterRouteChange: false
    }

    constructor(private alertService: AlertService, private angularFireStorage: AngularFireStorage) {

    }

    async storeImage(imageData: any) {
        try {
            const imageName = this.imageName()
            return new Promise((resolve, reject) => {
                this.alertService.info("Uploading ...", this.options)
                const pictureRef = this.angularFireStorage.ref(this.location + imageName)
                pictureRef.put(imageData).then(function () {
                    pictureRef.getDownloadURL().subscribe((url: any) => {
                        resolve(url)
                    })
                }).catch(error => {
                    this.alertService.error(this.clean(error), this.options)
                    reject(error)
                })

            })

        } catch (e) {
            console.log(e)
        }
    }

    private imageName(): number {
        const newTime = Math.floor(Date.now() / 1000)
        return Math.floor(Math.random() * 20) + newTime
    }


    private clean(error: any): string {
        let message = error.message as string
        if (error.code == "storage/unauthorized") {
            message = 'Image does not meet requirements.'
        }
        else {
            if (message.indexOf("Firebase:") >= 0) {
                message = message.replace("Firebase:", "").trim()
            }
            if (message.indexOf(".") > 0) {
                message = message.substring(0, message.indexOf(".")).trim()
            }
            if (message.indexOf("(") > 0) {
                message = message.substring(0, message.indexOf("(")).trim()
            }
        }
        return message
    }

}
