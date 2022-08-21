import Image from "next/image"
import Link from "next/link"
import styles from "./Header.module.css"

const Header = ({ user }) => {
  // const styles = {
  //   container: {
  //     display: "flex",
  //     justifyContent: "space-between",
  //     alignItems: "center",
  //     padding: 16,
  //     // backgroundColor: "pink",
  //   },
  //   versionsContainer: {
  //     marginLeft: 0,
  //     marginRight: "auto",
  //   },
  //   button: {
  //     marginLeft: 16,
  //     cursor: "pointer",
  //   },
  //   inline: {
  //     width: "100%",
  //     display: "flex",
  //   },
  // };
  return (
    <header style={{marginBottom:'20px'}}>
      <div className={styles.signedInStatus}>
        <div className={`nojs-show ${styles.loaded}`}>
          {!user.email && (
            <>
              <span className={styles.notSignedInText}>
                You are not signed in
              </span>
              <Link href="/auth">
                <a className={styles.buttonPrimary}>Sign in</a>
              </Link>
            </>
          )}

          {user.email && (
            <>
              <div className={styles.avatar}>
                <Image
                  src={user.photoURL}
                  width="100%"
                  height="100%"
                  layout="responsive"
                  objectFit="cover"
                />
              </div>
              {/* <img className={styles.avatar} src={user.photoURL}/> */}
              <span className={styles.signedInText}>
                <small>Signed in as</small>
                <br />
                <strong>{user.email}</strong>
              </span>
              <a
                // href={`/auth`}
                className={styles.button}
                onClick={() => {
                  user.signOut()
                }}
              >
                Sign out
              </a>
            </>
          )}
        </div>
        <div style={{ display: "flex" }}>
          <Link href="/">
            <a>Go back home</a>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header

{
  /* <header style={styles.container}>
{user.email ? (
  <>
    <div style={{ display: "flex", gap: "1rem" }}>
      <img
        style={{
          width: "3rem",
          height: "3rem",
          alignSelf: "center",
          borderRadius: "50%",
          objectFit: "cover",
        }}
        src={user.photoURL}
      />

      <p>
        Signed in as{" "}
        <strong>
          <span style={{ display: "block" }}>{user.email}</span>
        </strong>
      </p>
    </div>

    <button
      type="button"
      onClick={() => {
        user.signOut();
      }}
      style={styles.button}
    >
      Sign out
    </button>
  </>
) : (
  <>
    <p>You are not signed in.</p>
    <Link href="/auth">
      <a>
        <button type="button" style={styles.button}>
          Sign in
        </button>
      </a>
    </Link>
  </>
)}
</header> */
}
