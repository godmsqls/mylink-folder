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
  getDoc,
  setDoc,
  where,
} from "firebase/firestore";
import { app } from "@/lib/firebase";
import { LinkItem, PROFILE_DATA } from "@/data/profile";

const db = getFirestore(app);

export interface UserProfile {
  uid: string;
  displayName: string;
  username: string;
  bio: string;
  photoURL: string;
  email: string;
  updatedAt?: number;
}

/**
 * Firestore users/{userId} 경로에서 사용자 프로필을 조회합니다.
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (!userDoc.exists()) {
    return null;
  }
  const data = userDoc.data();
  return {
    uid: userId,
    displayName: data.displayName || "",
    username: data.username || "",
    bio: data.bio || "",
    photoURL: data.photoURL || "",
    email: data.email || "",
    updatedAt: data.updatedAt,
  };
}

/**
 * firestore users 컬렉션에서 동일한 displayName을 가진 다른 사용자 문서가 존재하는지 조회합니다.
 * @param userId 현재 사용자 uid (자신의 문서는 중복 검사 대상에서 제외)
 * @param displayName 중복 검사할 표시 이름
 * @returns 중복된 다른 사용자가 존재하면 true, 없으면 false
 */
export async function checkDisplayNameDuplicate(
  userId: string,
  displayName: string
): Promise<boolean> {
  const cleanName = displayName.trim();
  if (!cleanName) return false;

  const usersRef = collection(db, "users");
  const q = query(usersRef, where("displayName", "==", cleanName));
  const snap = await getDocs(q);

  // 본인의 문서(doc.id === userId)가 아닌 다른 문서가 존재하는지 확인
  return snap.docs.some((d) => d.id !== userId);
}

/**
 * Firestore users/{userId} 경로에 사용자 프로필 데이터를 저장(생성/병합)합니다.
 */
export async function saveUserProfile(
  userId: string,
  profile: Partial<UserProfile>
): Promise<void> {
  const userDocRef = doc(db, "users", userId);
  await setDoc(
    userDocRef,
    {
      ...profile,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

/**
 * 로그인 시 사용자의 Firestore 프로필 문서를 확인하고, 없으면 기본값으로 초기화합니다.
 */
export async function ensureUserProfile(
  userId: string,
  initialData: {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
  }
): Promise<UserProfile> {
  const existing = await getUserProfile(userId);
  if (existing) {
    return existing;
  }

  // 기본값 생성
  const defaultDisplayName = initialData.displayName || PROFILE_DATA.name;
  const defaultUsername = initialData.email
    ? initialData.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "")
    : `user_${userId.slice(0, 5)}`;
  const defaultBio = PROFILE_DATA.bio;
  const defaultPhotoURL =
    initialData.photoURL || PROFILE_DATA.avatarImage;

  const newProfile: UserProfile = {
    uid: userId,
    displayName: defaultDisplayName,
    username: defaultUsername,
    bio: defaultBio,
    photoURL: defaultPhotoURL,
    email: initialData.email || PROFILE_DATA.email,
  };

  await saveUserProfile(userId, newProfile);
  return newProfile;
}

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
