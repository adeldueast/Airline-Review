import { withAuthUser, AuthAction } from 'next-firebase-auth'
import FirebaseAuth from '../components/FirebaseAuth'
import FullPageLoader from './../components/FullPageLoader';

const styles = {
  content: {
    marginTop:'200px',
    padding: `8px 32px`,
   'textAlign':'center'
  },
}

const Auth = () => (
  <div style={styles.content}>
   <strong> THIS IS THE AUTH PAGE  AND ITS CLIENT SIDE RENDERING.IT ALSO DISPLAYS A LOADER COMPONENT WHILE FIREBASE SDK LOADS (Optional)</strong>
    <h3 >Sign in</h3>
    <div>
      <FirebaseAuth/>
    </div>
  </div>
)

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,//The action to take if the user is authenticated
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,//The action to take if the user is not authenticated but the Firebase client JS SDK has not yet initialized.
  whenUnauthedAfterInit: AuthAction.RENDER,//||NULL -> The action to take if the user is not authenticated and the Firebase client JS SDK has already initialized.
  LoaderComponent: FullPageLoader,
})(Auth)