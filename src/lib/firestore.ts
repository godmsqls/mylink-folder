import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { app } from "@/lib/firebase";
import { LinkItem } from "@/data/profile";

const db = getFirestore(app);

/** users/{userId}/links 컬렉션 참조 */
const linksCol = (userId: string) =>
  collection(db, "users", userId, "links");

/**
 * 사용자의 Firestore 경로(users/{userId}/links)에 링크를 추가합니다.
 * @returns Firestore가 발급한 document ID
 */
export async function addLink(userId: string, link: LinkItem): Promise<string> {
  const docRef = await addDoc(linksCol(userId), {
    type: link.type,
    title: link.title,
    subtitle: link.subtitle ?? null,
    url: link.url ?? null,
    iconName: link.iconName ?? null,
    badgeText: link.badgeText ?? null,
    isActive: link.isActive,
    order: link.order,
    createdAt: Date.now(),
  });
  return docRef.id;
}

/**
 * Firestore의 users/{userId}/links/{id} 문서를 수정합니다.
 */
export async function updateLink(
  userId: string,
  id: string,
  link: Partial<LinkItem>
): Promise<void> {
  const docRef = doc(db, "users", userId, "links", id);
  await updateDoc(docRef, {
    type: link.type,
    title: link.title,
    subtitle: link.subtitle ?? null,
    url: link.url ?? null,
    iconName: link.iconName ?? null,
    badgeText: link.badgeText ?? null,
    isActive: link.isActive,
    order: link.order,
  });
}

/**
 * Firestore의 users/{userId}/links/{id} 문서를 삭제합니다.
 */
export async function deleteLink(userId: string, id: string): Promise<void> {
  const docRef = doc(db, "users", userId, "links", id);
  await deleteDoc(docRef);
}

/**
 * Firestore의 users/{userId}/links 컬렉션에서 링크 목록을 createdAt 내림차순으로 불러옵니다.
 */
export async function fetchLinks(userId: string): Promise<LinkItem[]> {
  const q = query(linksCol(userId), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      type: data.type,
      title: data.title,
      subtitle: data.subtitle ?? undefined,
      url: data.url ?? undefined,
      iconName: data.iconName ?? undefined,
      badgeText: data.badgeText ?? undefined,
      isActive: data.isActive,
      order: data.order,
      createdAt: data.createdAt ?? undefined,
    } as LinkItem;
  });
}
