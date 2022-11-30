import { Injectable } from '@angular/core';
import {
  doc,
  getDoc,
  setDoc,
  Firestore,
  FirestoreError,
  deleteDoc,
  onSnapshot,
  collection,
  QueryConstraint,
  query,
  getDocs,
  writeBatch,
  FieldPath,
  DocumentData,
  QueryDocumentSnapshot,
  updateDoc,
  QuerySnapshot,
  runTransaction,
  DocumentReference,
  DocumentSnapshot,
  collectionGroup,
} from '@angular/fire/firestore';
import { IBookInventory } from 'src/data/models/entities/ibook-inventory';
import { IPublishedBook } from 'src/data/models/entities/ipublished-books';
import { IDocId } from 'src/data/models/idoc-id';
import { Logger } from 'src/helpers/utils/logger';
import { Fields } from '../fields';
import { IDatabase } from '../idatabase';
import { ErrorCodes } from './ErrorCodes';

@Injectable()
export class FirestoreService implements IDatabase {
  constructor(private firestore: Firestore) {}

  updateEarningAndDeletePaymentReqForBookTrans(
    bookEarningsDodRef: DocumentReference<DocumentData>,
    paymentReqDocRef: DocumentReference<DocumentData>,
    amount:number
  ) {
    return runTransaction(this.firestore,
      async (transaction) => {
        transaction.update(bookEarningsDodRef, Fields.totalPaid, amount);
        transaction.delete(paymentReqDocRef);
      }
    );
  }

  uploadBookDataTransaction(
    sNDocRef: DocumentReference<DocumentData>,
    bookUploadDocRef: DocumentReference<DocumentData>,
    book: IPublishedBook
  ): Promise<void> {
    return runTransaction(this.firestore, async (transaction) => {
      const sNDoc = await transaction.get(sNDocRef);
      const data = sNDoc.data();
      const json = JSON.stringify(data);
      const bookInventory: IBookInventory = JSON.parse(json);
      book.serialNo = bookInventory.total;
      transaction.set(bookUploadDocRef, book);
    });
  }

  getDocRef(path: string, pathSegment: string[]) {
    return doc(this.firestore, path, ...pathSegment);
  }

  addDocData(
    path: string,
    pathSegment: string[],
    type: any,
    merge = { merge: true }
  ): Promise<void> {
    const docRef = doc(this.firestore, path, ...pathSegment);
    return setDoc(docRef, type, merge);
  }

  deleteAllDocs(path: string, pathSegment: string[], docIds: IDocId[]) {
    const batch = writeBatch(this.firestore);
    for (let index = 0; index < docIds.length; index++) {
      const pathSegmentWithId = pathSegment.concat([docIds[index].docId!]);
      const docRef = doc(this.firestore, path, ...pathSegmentWithId);
      batch.delete(docRef);
    }
    return batch.commit();
  }

  updateDocData(
    path: string,
    pathSegment: string[],
    object: any
  ): Promise<void> {
    const docRef = doc(this.firestore, path, ...pathSegment);
    return updateDoc(docRef, object);
  }

  updateDocField(
    path: string,
    pathSegment: string[],
    field: string | FieldPath,
    fieldValue: unknown
  ) {
    const docRef = doc(this.firestore, path, ...pathSegment);
    return updateDoc(docRef, field, fieldValue);
  }

  updateAllDocData<T>(
    path: string,
    pathSegment: string[],
    field: string | FieldPath,
    fieldValue: unknown,
    docIds: IDocId[]
  ) {
    const batch = writeBatch(this.firestore);
    for (let index = 0; index < docIds.length; index++) {
      const pathSegmentWithId = pathSegment.concat([docIds[index].docId!]);
      const docRef = doc(this.firestore, path, ...pathSegmentWithId);
      batch.update(docRef, field, fieldValue);
    }
    return batch.commit();
  }

  deleteDoc(path: string, pathSegment: string[]): Promise<void> {
    const docRef = doc(this.firestore, path, ...pathSegment);
    return deleteDoc(docRef);
  }

  async getArrayOfDocDataWhere<T>(
    path: string,
    pathSegment: string[],
    queryConstraint: QueryConstraint[]
  ): Promise<T[]> {
    const q = query(
      collection(this.firestore, path, ...pathSegment),
      ...queryConstraint
    );
    const querySnapshot = await getDocs(q);
    return this.querySnapshotToArrayOfType<T>(querySnapshot);
  }

  async getQuerySnapshotWhereWithQueryGroup(
    collection: string,
    queryConstraint: QueryConstraint[]
  ): Promise<QuerySnapshot<DocumentData>> {
    const q = query(
      collectionGroup(this.firestore, collection),
      ...queryConstraint
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  }

  async getArrayOfDocData<T>(
    path: string,
    pathSegment: string[]
  ): Promise<T[]> {
    const q = query(collection(this.firestore, path, ...pathSegment));
    const querySnapshot = await getDocs(q);
    return this.querySnapshotToArrayOfType(querySnapshot);
  }

  getLiveArrayOfDocData<T>(
    path: string,
    pathSegment: string[],
    queryConstraint: QueryConstraint[],
    onNext: (type: T[], arrayOfDocIds: string[]) => void,
    onError: (errorCode: string) => void
  ) {
    const q = query(
      collection(this.firestore, path, ...pathSegment),
      ...queryConstraint
    );

   
    const unsubscribe = onSnapshot(q, {
      next: (querySnapShot) => {
         const dataArray: T[] = [];
         const arrayOfIds: string[] = [];
        querySnapShot.forEach((queryDoc) => {
          if (queryDoc.exists()) {
            const data = queryDoc.data();
            const json = JSON.stringify(data);
            const type: T = JSON.parse(json);
            dataArray.push(type);
            arrayOfIds.push(queryDoc.id);
          }
        });
        onNext(dataArray, arrayOfIds);
      },
      error: (error: FirestoreError) => {
        const errorCode = error.code.toString();
        onError(errorCode);
      },
    });
    return unsubscribe;
  }

  async getQueryDocumentSnapshot(
    path: string,
    pathSegment: string[]
  ): Promise<QueryDocumentSnapshot<DocumentData> | null> {
    const docRef = doc(this.firestore, path, ...pathSegment);
    const docSnapShot = await getDoc(docRef);
    if (docSnapShot.exists()) {
      return docSnapShot;
    } else {
      return null;
    }
  }

  async getDocData<T>(path: string, pathSegment: string[]): Promise<T | null> {
    const docRef = doc(this.firestore, path, ...pathSegment);
    const docSnapShot = await getDoc(docRef);

    return this.documentDataSnapshotToType<T>(docSnapShot);
  }

  getLiveDocData<T>(
    path: string,
    pathSegment: string[],
    onNext: (type: T) => void
  ) {
    const ref = doc(this.firestore, path, ...pathSegment);
    const unsubscribe = onSnapshot(ref, {
      next: (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const json = JSON.stringify(data);
          const type: T = JSON.parse(json);
          onNext(type);
        }
      },
      error: (error: FirestoreError) => {
        Logger.error('FirestoreService', 'getLiveData', error);
        const code = error.code.toString();
        if (code !== ErrorCodes.permDenied && code !== ErrorCodes.unauth) {
          setTimeout(() => {
            this.getLiveDocData(path, pathSegment, onNext);
          }, 2000);
        }
      },
    });
    return unsubscribe;
  }

  documentDataSnapshotToType<T>(docSnapShot: DocumentSnapshot<DocumentData>) {
    if (docSnapShot.exists()) {
      const data = docSnapShot.data();
      const json = JSON.stringify(data);
      const type: T = JSON.parse(json);
      return type;
    } else {
      return null;
    }
  }

  querySnapshotToArrayOfType<T>(
    querySnapshot: QuerySnapshot<DocumentData>
  ): T[] {
    const dataArray: T[] = [];
    querySnapshot.forEach((queryDoc) => {
      if (queryDoc.exists()) {
        const data = queryDoc.data();
        const json = JSON.stringify(data);
        const type: T = JSON.parse(json);
        dataArray.push(type);
      }
    });
    return dataArray;
  }
}
