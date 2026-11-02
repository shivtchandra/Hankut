import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CONNECTIONS_EDITION_3 = {
  id: "c3333333-3333-4333-8333-333333333333",
  type: "connections",
  title: "Daily Connections #3",
  description: "Group 16 dramas into sets of 4 with a common connection.",
  difficulty: 5,
  status: "published",
  metadata: {
    groups: [
      {
        id: "g1",
        label: "재벌가 & 후계자 로맨스",
        labelEn: "Romantic Chaebol & Heiress",
        description: "거대 재벌 후계자와 사랑에 빠지는 클래식 로코 명작들",
        descriptionEn: "Iconic romantic dramas featuring wealthy heirs and corporate chaebols",
        difficulty: "easy",
        items: [
          { id: "c1", text: "사랑의 불시착", textEn: "Crash Landing on You", groupId: "g1" },
          { id: "c2", text: "상속자들", textEn: "The Heirs", groupId: "g1" },
          { id: "c3", text: "사내맞선", textEn: "Business Proposal", groupId: "g1" },
          { id: "c4", text: "킹더랜드", textEn: "King the Land", groupId: "g1" },
        ],
      },
      {
        id: "g2",
        label: "조선 왕실 & 궁중 로맨스 사극",
        labelEn: "Joseon Royalty & Palace Romance",
        description: "궁궐의 암투 속에서 피어난 애틋한 왕실 사극 로맨스",
        descriptionEn: "Emotional palace sageuks centered on kings, queens, and crown princes",
        difficulty: "medium",
        items: [
          { id: "c5", text: "옷소매 붉은 끝동", textEn: "The Red Sleeve", groupId: "g2" },
          { id: "c6", text: "슈룹", textEn: "Under the Queen's Umbrella", groupId: "g2" },
          { id: "c7", text: "해를 품은 달", textEn: "Moon Embracing the Sun", groupId: "g2" },
          { id: "c8", text: "철인왕후", textEn: "Mr. Queen", groupId: "g2" },
        ],
      },
      {
        id: "g3",
        label: "처절한 복수 & 다크 응징 스릴러",
        labelEn: "Dark Revenge & Vigilante Justice",
        description: "악인들을 향해 처절하고 치밀한 사적 응징을 펼치는 복수극",
        descriptionEn: "High-stakes vengeance thrillers taking down corrupt villains",
        difficulty: "hard",
        items: [
          { id: "c9", text: "더 글로리", textEn: "The Glory", groupId: "g3" },
          { id: "c10", text: "모범택시", textEn: "Taxi Driver", groupId: "g3" },
          { id: "c11", text: "마이 네임", textEn: "My Name", groupId: "g3" },
          { id: "c12", text: "펜트하우스", textEn: "The Penthouse", groupId: "g3" },
        ],
      },
      {
        id: "g4",
        label: "비밀 신분 & 듀얼 아이덴티티",
        labelEn: "Secret / Dual Identities",
        description: "진짜 정체를 숨기거나 다른 인격으로 살아가는 캐릭터들",
        descriptionEn: "Thrilling stories of protagonists carrying hidden identities or split personas",
        difficulty: "brutal",
        items: [
          { id: "c13", text: "힐러", textEn: "Healer", groupId: "g4" },
          { id: "c14", text: "킬미, 힐미", textEn: "Kill Me, Heal Me", groupId: "g4" },
          { id: "c15", text: "악의 꽃", textEn: "Flower of Evil", groupId: "g4" },
          { id: "c16", text: "뷰티 인사이드", textEn: "The Beauty Inside", groupId: "g4" },
        ],
      },
    ],
  },
};

const CONNECTIONS_EDITION_4 = {
  id: "c4444444-4444-4444-8444-444444444444",
  type: "connections",
  title: "Daily Connections #4",
  description: "Group 16 dramas into sets of 4 with a common connection.",
  difficulty: 5,
  status: "published",
  metadata: {
    groups: [
      {
        id: "g1",
        label: "청춘 & 학원 로맨스 명작",
        labelEn: "Youth & Campus Romance",
        description: "풋풋한 학창시절과 캠퍼스를 배경으로 한 설렘 로맨스",
        descriptionEn: "Heartfluttering school and university campus love stories",
        difficulty: "easy",
        items: [
          { id: "c1", text: "여신강림", textEn: "True Beauty", groupId: "g1" },
          { id: "c2", text: "어쩌다 발견한 하루", textEn: "Extraordinary You", groupId: "g1" },
          { id: "c3", text: "역도요정 김복주", textEn: "Weightlifting Fairy Kim Bok-joo", groupId: "g1" },
          { id: "c4", text: "치즈인더트랩", textEn: "Cheese in the Trap", groupId: "g1" },
        ],
      },
      {
        id: "g2",
        label: "생명을 살리는 메디컬 의드",
        labelEn: "Medical & Hospital Heroes",
        description: "병원에서 펼쳐지는 의사들의 치열한 사명감과 인간미",
        descriptionEn: "Heartwarming and tense medical dramas centered on doctors",
        difficulty: "medium",
        items: [
          { id: "c5", text: "슬기로운 의사생활", textEn: "Hospital Playlist", groupId: "g2" },
          { id: "c6", text: "낭만닥터 김사부", textEn: "Dr. Romantic", groupId: "g2" },
          { id: "c7", text: "닥터 슬럼프", textEn: "Doctor Slump", groupId: "g2" },
          { id: "c8", text: "닥터 이방인", textEn: "Doctor Stranger", groupId: "g2" },
        ],
      },
      {
        id: "g3",
        label: "초자연 존재 & 신비한 판타지",
        labelEn: "Supernatural Fantasy Creatures",
        description: "구미호, 도깨비, 저승사자 등 신비로운 초자연적 존재들의 이야기",
        descriptionEn: "Dramas centered on mythical deities, gumihos, and spirits",
        difficulty: "hard",
        items: [
          { id: "c9", text: "호텔 델루나", textEn: "Hotel Del Luna", groupId: "g3" },
          { id: "c10", text: "간 떨어지는 동거", textEn: "My Roommate is a Gumiho", groupId: "g3" },
          { id: "c11", text: "어느 날 우리 집 현관으로 멸망이 들어왔다", textEn: "Doom at Your Service", groupId: "g3" },
          { id: "c12", text: "구미호뎐", textEn: "Tale of the Nine Tailed", groupId: "g3" },
        ],
      },
      {
        id: "g4",
        label: "평행세계 & 차원 이동 스릴러",
        labelEn: "Parallel Worlds & Multiverse",
        description: "또 다른 차원의 세계와 시공간을 넘나드는 미스터리",
        descriptionEn: "Mind-bending dramas traveling across alternate dimensions",
        difficulty: "brutal",
        items: [
          { id: "c13", text: "더 킹 : 영원의 군주", textEn: "The King: Eternal Monarch", groupId: "g4" },
          { id: "c14", text: "W (더블유)", textEn: "W: Two Worlds", groupId: "g4" },
          { id: "c15", text: "트레인", textEn: "Train", groupId: "g4" },
          { id: "c16", text: "앨리스", textEn: "Alice", groupId: "g4" },
        ],
      },
    ],
  },
};

async function publish() {
  console.log("1. Upserting puzzles into 'puzzles' table...");
  const { error: pErr1 } = await supabase.from("puzzles").upsert(CONNECTIONS_EDITION_3);
  if (pErr1) console.error("Error upserting Edition 3:", pErr1);
  else console.log("✓ Upserted Daily Connections #3");

  const { error: pErr2 } = await supabase.from("puzzles").upsert(CONNECTIONS_EDITION_4);
  if (pErr2) console.error("Error upserting Edition 4:", pErr2);
  else console.log("✓ Upserted Daily Connections #4");

  console.log("\n2. Upserting daily sets for 2026-11-02 (Today) and 2026-11-03 (Tomorrow)...");
  
  // Daily Set for 2026-11-02
  const { data: setToday, error: sErr1 } = await supabase
    .from("daily_sets")
    .upsert({
      game_date: "2026-11-02",
      title: "Daily Connections #3",
      status: "published",
      published_at: new Date().toISOString(),
    }, { onConflict: "game_date" })
    .select("id")
    .single();

  if (sErr1) console.error("Error with set 2026-11-02:", sErr1);
  else console.log("✓ Set 2026-11-02 ID:", setToday?.id);

  // Daily Set for 2026-11-03
  const { data: setTom, error: sErr2 } = await supabase
    .from("daily_sets")
    .upsert({
      game_date: "2026-11-03",
      title: "Daily Connections #4",
      status: "published",
      published_at: new Date().toISOString(),
    }, { onConflict: "game_date" })
    .select("id")
    .single();

  if (sErr2) console.error("Error with set 2026-11-03:", sErr2);
  else console.log("✓ Set 2026-11-03 ID:", setTom?.id);

  console.log("\n3. Linking puzzles to daily sets in 'daily_set_items'...");
  if (setToday?.id) {
    // Delete existing items for clean slot
    await supabase.from("daily_set_items").delete().eq("daily_set_id", setToday.id);
    const { error: itemErr1 } = await supabase.from("daily_set_items").insert({
      daily_set_id: setToday.id,
      puzzle_id: CONNECTIONS_EDITION_3.id,
      position: 1,
    });
    if (itemErr1) console.error("Error linking 2026-11-02 item:", itemErr1);
    else console.log("✓ Linked Daily Connections #3 to 2026-11-02");
  }

  if (setTom?.id) {
    // Delete existing items for clean slot
    await supabase.from("daily_set_items").delete().eq("daily_set_id", setTom.id);
    const { error: itemErr2 } = await supabase.from("daily_set_items").insert({
      daily_set_id: setTom.id,
      puzzle_id: CONNECTIONS_EDITION_4.id,
      position: 1,
    });
    if (itemErr2) console.error("Error linking 2026-11-03 item:", itemErr2);
    else console.log("✓ Linked Daily Connections #4 to 2026-11-03");
  }

  console.log("\nAll Done!");
}

publish();
