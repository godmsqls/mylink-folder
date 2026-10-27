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

/** users/anonymous/links 컬렉션 참조 */
const linksCol = () =>
  collection(db, "users", "anonymous", "links");

/**
 * 링크를 Firestore에 추가합니다.
 * @returns Firestore가 발급한 document ID
 */
export async function addLink(link: LinkItem): Promise<string> {
  const docRef = await addDoc(linksCol(), {
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
 * Firestore의 링크 문서를 수정합니다.
 */
export async function updateLink(id: string, link: Partial<LinkItem>): Promise<void> {
  const docRef = doc(db, "users", "anonymous", "links", id);
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
 * Firestore에서 링크 문서를 삭제합니다.
 */
export async function deleteLink(id: string): Promise<void> {
  const docRef = doc(db, "users", "anonymous", "links", id);
  await deleteDoc(docRef);
}

/**
 * Firestore에서 링크 목록을 createdAt 내림차순으로 불러옵니다.
 */
export async function fetchLinks(): Promise<LinkItem[]> {
  const q = query(linksCol(), orderBy("createdAt", "desc"));
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
