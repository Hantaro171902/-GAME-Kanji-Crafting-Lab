import { useState, type FormEvent } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FRIENDS_DATA,
  INITIAL_CHAT_MESSAGES,
  RANKING_DATA,
  type ChatMessage,
  type FriendEntry,
} from "@/game/data";
import { pick, useLang, useT } from "@/game/i18n";
import { sfx } from "@/game/store";
import mochiAvatar from "@/assets/new-design/image 21.svg";
import komaAvatar from "@/assets/new-design/image 22.svg";
import yuzuAvatar from "@/assets/new-design/image 23.svg";
import hanaAvatar from "@/assets/new-design/image 24.svg";

const AVATAR_MAP: Record<FriendEntry["avatarKey"], string> = {
  mochi: mochiAvatar,
  koma: komaAvatar,
  yuzu: yuzuAvatar,
  hana: hanaAvatar,
};

/**
 * Clean hook abstraction for community chat.
 * Uses local mock state in prototype mode and can be swapped to
 * `supabase.channel('public:chat_messages')` real-time subscriptions.
 */
function useSocialChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sfx("tap");
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes(),
    ).padStart(2, "0")}`;

    const playerMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "player",
      senderName: "Mochi (You)",
      avatarKey: "mochi",
      text: trimmed,
      timestamp,
      isPlayer: true,
    };
    setMessages((prev) => [...prev, playerMsg]);

    // Simulated friendly companion reply
    setTimeout(() => {
      const replies: ChatMessage[] = [
        {
          id: `reply-${Date.now()}`,
          senderId: "mori",
          senderName: "Mori",
          avatarKey: "mochi",
          text: {
            en: "Hoo-hoo! Keep exploring the Radical Mine and check the dashed guide in your Bento Box!",
            ja: "ホーホー！部首鉱山を探検して、弁当箱の点線ガイドを見てみよう！",
            vi: "Hoo-hoo! Hãy tiếp tục khám phá Mỏ Bộ Thủ và xem đường nét đứt trong Hộp Bento nhé!",
          },
          timestamp,
        },
        {
          id: `reply-${Date.now()}`,
          senderId: "koma",
          senderName: "Koma",
          avatarKey: "koma",
          text: {
            en: "Nice! Watch out for different radical shapes like 1×3 and 2×2 when digging!",
            ja: "いいね！掘るときは 1×3 や 2×2 の形に注目してみて！",
            vi: "Hay lắm! Hãy chú ý các mảnh 1×3 và 2×2 khi đào nhé!",
          },
          timestamp,
        },
      ];
      const pickReply = replies[Math.floor(Math.random() * replies.length)]!;
      sfx("good");
      setMessages((prev) => [...prev, pickReply]);
    }, 900);
  };

  return { messages, sendMessage };
}

export function SocialDrawer({
  open,
  onOpenChange,
  playerLevel,
  discoveredCount,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playerLevel: number;
  discoveredCount: number;
}) {
  const t = useT();
  const lang = useLang();
  const { messages, sendMessage } = useSocialChat();
  const [draft, setDraft] = useState("");
  const [activeTab, setActiveTab] = useState("friends");

  // Combine mock leaderboard with live player entry sorted by score
  const playerScore = playerLevel * 200 + discoveredCount * 80 + 150;
  const fullRanking = [
    ...RANKING_DATA,
    {
      id: "player",
      name: `${t("mochiName")} (You)`,
      avatarKey: "mochi" as const,
      level: playerLevel,
      kanjiCount: discoveredCount,
      score: playerScore,
      isPlayer: true,
    },
  ].sort((a, b) => b.score - a.score);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-l-4 border-[#5c3e26] bg-[#f7eed9] p-4 text-[#3b2818] sm:max-w-md"
      >
        <SheetHeader className="border-b-2 border-[#c8b28e] pb-3 text-left">
          <SheetTitle className="font-display text-2xl text-[#4a321f]">
            🌿 {t("friendsBtn")} & {t("rankingTab")}
          </SheetTitle>
          <SheetDescription className="text-xs text-[#6e4f35]">
            Kotoba Forest Travelers · Lv. {playerLevel}
          </SheetDescription>
        </SheetHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            sfx("tap");
            setActiveTab(v);
          }}
          className="mt-2 flex flex-1 flex-col overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-3 border-2 border-[#5c3e26] bg-[#e5d5b5] p-1">
            <TabsTrigger
              value="friends"
              className="font-bold data-[state=active]:bg-[#4b8b55] data-[state=active]:text-white"
            >
              👥 {t("friendsBtn")}
            </TabsTrigger>
            <TabsTrigger
              value="ranking"
              className="font-bold data-[state=active]:bg-[#4b8b55] data-[state=active]:text-white"
            >
              🏆 {t("rankingTab")}
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="font-bold data-[state=active]:bg-[#4b8b55] data-[state=active]:text-white"
            >
              💬 {t("chatTab")}
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: FRIENDS (styled after new-design/image 13.svg) */}
          <TabsContent value="friends" className="mt-3 flex-1 overflow-hidden">
            <ScrollArea className="h-[calc(100vh-190px)] pr-2">
              <div className="space-y-3">
                {FRIENDS_DATA.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-3 rounded-2xl border-2 border-[#7b5836] bg-[#fbf5e6] p-3 shadow-sm"
                  >
                    <img
                      src={AVATAR_MAP[friend.avatarKey]}
                      alt={friend.name}
                      className="h-14 w-14 shrink-0 rounded-full object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-lg font-bold text-[#3b2818]">
                          {friend.name}
                        </span>
                        {friend.status === "online" ? (
                          <span className="rounded-lg bg-[#4b8b55] px-2.5 py-0.5 text-xs font-bold text-white">
                            {t("online")}
                          </span>
                        ) : (
                          <span className="rounded-lg border border-[#b99e75] bg-[#ecdcc0] px-2.5 py-0.5 text-xs font-bold text-[#5c3e26]">
                            Level {friend.level}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-[#6e4f35]">
                        {pick(friend.role, lang)}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-[#5c3e26]/90">
                        {pick(friend.bio, lang)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* TAB 2: RANKING */}
          <TabsContent value="ranking" className="mt-3 flex-1 overflow-hidden">
            <div className="mb-2 rounded-xl border border-[#b99e75] bg-[#ecdcc0] px-3 py-1.5 text-xs font-bold text-[#4a321f]">
              🏆 {t("currentLevelRanking")} (Lv. {playerLevel})
            </div>
            <ScrollArea className="h-[calc(100vh-230px)] pr-2">
              <div className="space-y-2.5">
                {fullRanking.map((entry, idx) => {
                  const rank = idx + 1;
                  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-3 rounded-2xl border-2 p-2.5 transition ${
                        entry.isPlayer
                          ? "border-[#4b8b55] bg-[#e2f0df] shadow-md"
                          : "border-[#7b5836] bg-[#fbf5e6]"
                      }`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center font-display text-lg font-bold text-[#4a321f]">
                        {medal}
                      </div>
                      <img
                        src={AVATAR_MAP[entry.avatarKey]}
                        alt={entry.name}
                        className="h-11 w-11 shrink-0 rounded-full object-contain"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-bold text-[#3b2818]">
                          {entry.name}
                        </div>
                        <div className="text-xs text-[#6e4f35]">
                          Lv. {entry.level} · {entry.kanjiCount} Kanji
                        </div>
                      </div>
                      <div className="rounded-xl bg-[#e8d6b3] px-2.5 py-1 text-right font-mono text-xs font-extrabold text-[#4a321f]">
                        {entry.score} pts
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* TAB 3: CHAT */}
          <TabsContent value="chat" className="mt-3 flex flex-1 flex-col overflow-hidden">
            <ScrollArea className="flex-1 rounded-2xl border-2 border-[#7b5836] bg-[#fbf5e6] p-3">
              <div className="space-y-3 pr-2">
                {messages.map((msg) => {
                  const content =
                    typeof msg.text === "string" ? msg.text : pick(msg.text, lang);
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${
                        msg.isPlayer ? "flex-row-reverse" : ""
                      }`}
                    >
                      <img
                        src={AVATAR_MAP[msg.avatarKey]}
                        alt={msg.senderName}
                        className="h-9 w-9 shrink-0 rounded-full object-contain"
                      />
                      <div
                        className={`max-w-[78%] rounded-2xl border px-3 py-2 text-xs shadow-xs ${
                          msg.isPlayer
                            ? "border-[#3c7344] bg-[#4b8b55] text-white"
                            : "border-[#c8b28e] bg-[#f3e6cb] text-[#3b2818]"
                        }`}
                      >
                        <div className="mb-0.5 flex items-center justify-between gap-2 text-[10px] opacity-80">
                          <span className="font-bold">{msg.senderName}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <p className="leading-relaxed">{content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <form onSubmit={handleSend} className="mt-3 flex gap-2">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={t("typeMessage")}
                className="border-2 border-[#7b5836] bg-[#fbf5e6] text-[#3b2818] placeholder:text-[#8c6f4e]"
              />
              <Button
                type="submit"
                className="border-2 border-[#35663d] bg-[#4b8b55] font-bold text-white hover:bg-[#3f7848]"
              >
                {t("send")}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

export default SocialDrawer;
