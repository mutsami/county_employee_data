import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; 
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first, map, switchMap, take } from 'rxjs/operators'; 

import firebase from 'firebase/compat/app';  
import { Router } from '@angular/router'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  user$: Observable<any>;
  ts:any; 
  status:any;

  
  careerCollection!: AngularFirestoreCollection<any>;
  careers!: Observable<any[]>;
  careerDoc?: AngularFirestoreDocument<any>;

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore, private router: Router) { 
      this.ts = firebase.firestore.Timestamp.now()
      // Get the auth state, then fetch the Firestore user document or return null
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
            // Logged in
          if (user) { 
            this.afs.doc<any>(`users/${user.uid}`).snapshotChanges().subscribe(e=>{
              if(e.payload.data()?.verified){
                console.log('auth true')
                this.status = true;
              }else{
                console.log('auth false')
                this.status = false;
              }
            })
            
            return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
          } else {
            // Logged out
            
            this.status = false;
            console.log('user logged out')
            return of(null);
          }
      }))
    }

    // Sign in with Google
    async googleSignin() {
      return this.AuthLogin(new  firebase.auth.GoogleAuthProvider());
    }  
    // Auth logic to run auth providers
    AuthLogin(provider: firebase.auth.GoogleAuthProvider) {
      return this.afAuth.signInWithPopup(provider)
      .then((result) => { 
        return this.updateUserData(result.user);
      }).catch((error) => {
          console.log(error)
      })
    }

    updateUserData(user: any) { 
      // Sets user data to firestore on login
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

      const data = { 
        uid: user.uid, 
        email: user.email, 
        displayName: user.displayName, 
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber 
      } 

      return userRef.set(data, { merge: true })

    }

  async signOut() {
    await this.afAuth.signOut();
    this.router.navigate(['/']);
  }
 
 
  createProfile(data: any){
    return this.afs.collection('employee_data').add(data)
  }

checkStatus():any{
  let status ;
  return this.afAuth.authState.subscribe(e=>{

    return this.getUserProfileData(e?.uid).subscribe(r=>{
       
    if(e && r.verified){
      console.log('tr')
      return true
    }else{
      console.log('fls')
      return false
    } 
    }) 
  })
}

getData() {
  this.careerCollection = this.afs.collection('employee_data');
  return this.careerCollection
    .snapshotChanges().pipe(
      map(actions => {
      return actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
      });
      })
  );
}

getUserProfileData(id: any){
  return this.afs.doc(`users/${id}`).snapshotChanges().pipe(take(1)).pipe(
    map(a => {
      const data = a.payload.data() as any;
      const id = a.payload.id;
      return { id, ...data };
  })
);
  }

updateUser(id: string,verified: any) {
  this.afs.doc('users/' + id).update(
    {verified}
  )
}
deleteUser(user_id: string){ 
  this.afs.doc('users/' + user_id).delete().then(()=>{
    this.router.navigate(['/admin']).then(()=>{ 
        // this.notifyService.showInfo("The user has been deleted succefully.", "Saved!!")
    })

  })
}
}