import { getApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
  startAt,
  updateDoc,
  where,
} from "firebase/firestore";



export const getReviews = async (airlineId) => {
  try {
    const query = query(
      collection(getFirestore(getApp()), "reviews"),
      where("airlineId", "==", airlineId)
    );
    const docs = await getDocs(query);
    return docs.map((doc) => {
      const id = doc.id;
      const data = doc.data();
      return {
        id,
        ...data,
      };
    });
  } catch (error) {
    throw Error(error);
  }
};

export const getReviewsSubscription = (airlineId, userId, handleSetReviewsData) => {
  //query to get all reviews of airline
  const queryRef = query(collection(getFirestore(getApp()), "reviews"),where("airlineId", "==", airlineId));
  //return subscribtion 
  return onSnapshot(queryRef, (querySnapshot) => {
    //what to do on collection Changes =>
    let userReviewIndex;
    const reviews = querySnapshot.docs.map((doc, i) => {
      const id = doc.id;
      const data = doc.data();
      //while mapping, check any review belongs to current user (userId)
      if (data.userId == userId) {
        userReviewIndex = i;
      }
      const review = {
        id,
        ...data,
      };
      return review;
    });
    //if user has a review in the collection, move it to index 0 
    arrayMove(reviews, userReviewIndex, 0);
    //Calculat the avg rating of all reviews 
    const avgRating = reviews.reduce((total, next) => total + next.value, 0) / reviews.length;
    //set States 
    handleSetReviewsData(reviews,avgRating.toFixed(1))
  
  });
};

export const getUserReview = async (userId, airlineId) => {
  const docRef = doc(getFirestore(getApp()), collectionName, `${userId}_${airlineId}`);
  try {
    const doc = await getDoc(docRef);
    const id = doc.id;
    const data = doc.data();
    return {
      id,
      ...data,
    };
  } catch (error) {
    throw Error(error);
  }
};

export const upsertReview = async (review) => {

  const docId = `${review.userId}_${review.name}`;
  const docRef = doc(getFirestore(getApp()), "reviews", docId);
  try {
    return await setDoc(docRef, review, { merge: true });
  } catch (error) {
    throw Error(error);
  }
};

// TODO: Check for more optimized way
function arrayMove(arr, fromIndex, toIndex) {
  if (fromIndex === undefined) {
    // console.warn("user has no review.. 😡");
    return;
  }
  // console.warn("user has a review! 😁");
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}
// export const getCollectionAt = async <T>(collectionName: string, orderByElement: any, lastElement: any, state: boolean, uidUser: string) => {
//     let datas: any[] = [];
//     const lastDocSnap = await getDoc(doc(getFirestore(getApp()), lastElement));
//     const docs = await getDocs(query(collection(getFirestore(getApp()), collectionName), where('complete', '==', state), where('uidUser', '==', uidUser), orderBy(orderByElement), limit(10), startAfter(lastDocSnap)));

//     docs.forEach(
//         doc => {
//             const id = doc.id;
//             const data = doc.data();
//             datas.push({
//                 id,
//                 ...data,
//                 createdAt: new Date(data?.createdAt?.seconds * 1000) || null,
//                 dueAt: new Date(data.dueAt?.seconds * 1000) || null,
//                 updatedAt: new Date(data?.updatedAt?.seconds * 1000) || null
//             })
//         }
//     );
//     return datas as T[];
// }
