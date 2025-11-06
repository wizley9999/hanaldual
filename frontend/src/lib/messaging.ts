import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import { toast } from "sonner";

export const getFCMToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    return token;
  } catch (_) {
    throw new Error(
      "토큰을 가져올 수 없습니다. 알림 권한이 설정되어 있는지 확인해주세요."
    );
  }
};

export function listenForegroundMessages() {
  onMessage(messaging, (payload) => {
    toast.success(payload.data?.title, {
      description: payload.data?.body,
      position: "top-center",
      action: {
        label: "이동하기",
        onClick: () => window.open(payload.data?.link),
      },
    });
  });
}
