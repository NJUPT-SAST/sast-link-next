"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { getFeishuLoginStatus } from "@/lib/api/auth";
import { getUserInfo } from "@/lib/api/user";
import { setToken } from "@/lib/token";
import { useUserListStore } from "@/store/use-user-list-store";
import { BackLayout } from "@/components/layout/back-layout";

function FeishuCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addAccount = useUserListStore((s) => s.addAccount);

  const code = searchParams.get("code") ?? "";
  const state = searchParams.get("state") ?? "";

  useEffect(() => {
    if (!code || !state) return;

    getFeishuLoginStatus(code, state).then((feishuRes) => {
      if (feishuRes.data.Success) {
        const loginToken = feishuRes.data.Data.loginToken;
        setToken(loginToken);

        getUserInfo().then((res) => {
          if (res.data.Success) {
            const data = res.data.Data;
            addAccount({
              nickName: "NJUPTer",
              email: data.email,
              token: loginToken,
              userId: data.userId,
            });
            router.replace("/home");
          }
        });
      } else {
        if (feishuRes.data.Data?.oauthTicket) {
          router.replace(
            `/login?oauthTicket=${feishuRes.data.Data.oauthTicket}`,
          );
        }
      }
    });
  }, [code, state, router, addAccount]);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <Loader2 size={48} className="animate-spin text-[#1c1f23]" />
      </motion.div>
      <div className="text-lg">授权成功，正在重定向</div>
    </div>
  );
}

export default function FeishuCallbackPage() {
  return (
    <div className="grid h-screen w-screen place-items-center">
      <BackLayout type="blue" />
      <Suspense>
        <FeishuCallbackContent />
      </Suspense>
    </div>
  );
}
