import { getFirebaseAdmin } from "next-firebase-auth"
import Link from "next/link"

import {
  useAuthUser,
  withAuthUser,
  withAuthUserSSR,
} from "next-firebase-auth"
import Header from "../components/Header"
const Home = ({ airlines }) => {
  const AuthUser = useAuthUser()

  const listAirlines = airlines.map((airline) => (
    <li key={airline.id}>
      <Link
        href={{
          pathname: `/airlines/${airline.id}`,
        }}
      >
        <a>{airline.name}</a>
      </Link>
    </li>
  ))

  // console.log(AuthUser);
  return (
    <div>
      <Header user={AuthUser} />
      <strong> THIS IS THE HOME PAGE AND ITS SERVER SIDE RENDERING</strong>
      <ul>{listAirlines}</ul>
    </div>
  )
}

// Note that this is a higher-order function.
export const getServerSideProps = withAuthUserSSR({
})(async ({AuthUser}) => {
  console.log('AuthUser',AuthUser.AuthUser)

  // fetch all airlines in firestore and map it to airline array then send it to client in props
  const db = getFirebaseAdmin().firestore()
  const airlinesQuerySnapshot = await db.collection("airlines").get()
  const airlines = airlinesQuerySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),  
    }
  })

  // // console.log(airlines)
  return {
    props: {
      airlines: airlines,
    },
  }
})

export default withAuthUser({
})(Home)
