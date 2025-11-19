import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebase";
import { toast } from "sonner";

export const getFCMToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    return token;
  } catch {
    throw new Error(
      "토큰을 가져올 수 없습니다. 알림 권한이 설정되어 있는지 확인해주세요."
    );
  }
};

export function listenForegroundMessages() {
  onMessage(messaging, (payload) => {
    if (!payload.data) {
      return;
    }

    const data = payload.data;

    toast.success(data.title, {
      description: data.body,
      position: "top-center",
      action: {
        label: "이동하기",
        onClick: () => {
          window.open(`${data.link}?token=${data.token}`);
        },
      },
    });
  });
}
