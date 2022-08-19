import { useEffect, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
// this is how  we use app/auth from new firebase module update v.9
// https://github.com/gladly-team/next-firebase-auth/blob/v1.x/example/components/FirebaseAuth.js
import { getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";



const FirebaseAuth = () => {
  
  const firebaseAuthConfig = {
    signInFlow: "popup",
    // Auth providers
    // https://github.com/firebase/firebaseui-web#configure-oauth-providers
    signInOptions: [
      {
        provider: GoogleAuthProvider.PROVIDER_ID,
        requireDisplayName: false,
      },
    ],
    signInSuccessUrl: "/",
    credentialHelper: "none",
    callbacks: {
      // https://github.com/firebase/firebaseui-web#signinsuccesswithauthresultauthresult-redirecturl
      signInSuccessWithAuthResult:  (result) => {
        const db = getFirestore(getApp());
        //db/path/doc
        const userData = {
          displayName: result.user.displayName ,
          email: result.user.email,
          image: result.user.photoURL
        }
       // console.log(userData);
        setDoc(doc(db, 'users', `${ result.user.uid}`), userData, { merge: true })
        .catch(err=>console.error(err))
  
        // Don't automatically redirect. We handle redirects using
        // `next-firebase-auth`.
        return false;
        
      },
    },
  };


  // Do not SSR FirebaseUI, because it is not supported.
  // https://github.com/firebase/firebaseui-web/issues/213
  const [renderAuth, setRenderAuth] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRenderAuth(true);
    }
  }, []);

  return (
    <div>
      {renderAuth ? (
        <StyledFirebaseAuth   uiConfig={firebaseAuthConfig} firebaseAuth={getAuth(getApp())} />
      ) : null}
    </div>
  );
};

export default FirebaseAuth;
