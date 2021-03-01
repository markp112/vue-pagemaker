
import store from "@/store";
import {
  Module,
  Mutation,
  Action,
  VuexModule,
  getModule
} from "vuex-module-decorators";
import { BucketImage } from './models/bucket-image'
import {
  Notification,
  notificationDefault
} from "@/models/notifications/notifications";
import firebase from "firebase";
import { AuthModule } from "../auth/auth";

export interface CloudStorageInterface {
  _bucketName: string;
}

@Module({ name: "CloudStorage-module", dynamic: true, store })
class CloudStorageStore extends VuexModule implements CloudStorageInterface {
  _bucketName = '';

  @Mutation
  private setBucketName(bucketName: string) {
    this._bucketName = bucketName;
  }

  @Action
  public updateBucketName(bucketName: string) {
    this.context.commit('setBucketName', bucketName);
  }

  @Action
  public getImagesFromBucket(): Promise<BucketImage[]> {
    const userId = AuthModule.currentUser.id;
    const path = `${userId}/${this._bucketName}/`;
    const fileStore = firebase.storage().ref(path);
    return new Promise((resolve, reject) => {
      fileStore.listAll()
      .then (res => {
        const files: BucketImage[] = [];
        res.items.forEach(itemRef => {
            const bucketImage: BucketImage = { 
              bucket: itemRef.bucket,
              fullPath: itemRef.fullPath,
              name: itemRef.name,
            }
            files.push(bucketImage);
        })
        resolve(files);
      })
      .catch(err => {
        console.log('%c⧭', 'color: #d0bfff', err);
      })
    })
  }

  @Action
  getFileUrl(fileName: string): Promise<string> {
    const userId = AuthModule.currentUser.id;
    const path = `${userId}/${this._bucketName}/`;
    const fileStore = firebase.storage().ref(path);
    return new Promise((resolve, reject) => {
      fileStore.child(fileName).getDownloadURL()
      .then(url => {
        resolve(url);  
      })
    });
  }


  get bucketName(): string {
    return this._bucketName;
  }
}

export const CloudStorageModule = getModule(CloudStorageStore);
