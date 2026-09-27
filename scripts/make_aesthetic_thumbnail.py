from PIL import Image, ImageDraw, ImageFont, ImageFilter

WIDTH, HEIGHT = 1080, 1920

FONT_SERIF = "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"

f_title_serif = ImageFont.truetype(FONT_SERIF, 82)
f_sub_serif = ImageFont.truetype(FONT_SERIF, 44)
f_badge = ImageFont.truetype(FONT_BOLD, 26)
f_pill = ImageFont.truetype(FONT_BOLD, 30)
f_btn = ImageFont.truetype(FONT_BOLD, 32)
f_hud = ImageFont.truetype(FONT_BOLD, 26)
f_small = ImageFont.truetype(FONT_REG, 24)

# Load real Frame 1
frame1 = Image.open("real_db_frames/gangnam_beauty/frame-1.webp").convert("RGB")

# Base paper canvas (#FDFBF7 - Hankut warm paper)
canvas = Image.new("RGB", (WIDTH, HEIGHT), "#FDFBF7")
draw = ImageDraw.Draw(canvas)

# Subtle warm paper borders & background framing
draw.rectangle([36, 36, WIDTH - 36, HEIGHT - 36], outline="#E7E5E4", width=2)

# ── 1. Top Brand Header ──
# Seal
draw.ellipse([WIDTH // 2 - 45, 140, WIDTH // 2 + 45, 230], fill="#1C1917")
draw.text((WIDTH // 2 - 16, 162), "컷", font=ImageFont.truetype(FONT_BOLD, 40), fill="#FFFFFF")

brand_title = "H A N K U T"
b_bt = draw.textbbox((0, 0), brand_title, font=f_badge)
draw.text(((WIDTH - (b_bt[2] - b_bt[0])) // 2, 255), brand_title, font=f_badge, fill="#1C1917")

sub_brand = "KOREAN CULTURE DAILY"
b_sb = draw.textbbox((0, 0), sub_brand, font=f_small)
draw.text(((WIDTH - (b_sb[2] - b_sb[0])) // 2, 295), sub_brand, font=f_small, fill="#78716C")

# ── 2. Editorial Serif Headline ──
h1 = "Can you guess the K-drama"
b_h1 = draw.textbbox((0, 0), h1, font=f_title_serif)
draw.text(((WIDTH - (b_h1[2] - b_h1[0])) // 2, 365), h1, font=f_title_serif, fill="#1C1917")

h2 = "from only ONE cut?"
b_h2 = draw.textbbox((0, 0), h2, font=f_title_serif)
draw.text(((WIDTH - (b_h2[2] - b_h2[0])) // 2, 455), h2, font=f_title_serif, fill="#DC2626")

# Streak Badge
badge_w = 280
draw.rounded_rectangle([(WIDTH - badge_w) // 2, 570, (WIDTH + badge_w) // 2, 620], radius=25, fill="#F4F0E8", outline="#E7E5E4", width=1)
badge_txt = "DAILY PUZZLE #22"
b_bg = draw.textbbox((0, 0), badge_txt, font=f_badge)
draw.text(((WIDTH - (b_bg[2] - b_bg[0])) // 2, 582), badge_txt, font=f_badge, fill="#B45309")

# ── 3. Cinematic Photo Card (White Polaroid Style with Soft Shadow) ──
card_w, card_h = 960, 680
card_x = (WIDTH - card_w) // 2
card_y = 660

# Soft Drop Shadow
shadow = Image.new("RGBA", (card_w + 40, card_h + 40), (0, 0, 0, 0))
s_draw = ImageDraw.Draw(shadow)
s_draw.rounded_rectangle([20, 20, card_w + 20, card_h + 20], radius=24, fill=(28, 25, 23, 35))
shadow = shadow.filter(ImageFilter.GaussianBlur(radius=20))
canvas.paste(shadow, (card_x - 20, card_y - 10), shadow)

# White card body
draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=24, fill="#FFFFFF", outline="#E7E5E4", width=2)

# Photo inside card
pic_pad = 20
pic_w, pic_h = card_w - (pic_pad * 2), 540
frame_resized = frame1.resize((pic_w, pic_h), Image.Resampling.LANCZOS)
canvas.paste(frame_resized, (card_x + pic_pad, card_y + pic_pad))

# HUD on photo
hud = Image.new("RGBA", (pic_w, 54), (0, 0, 0, 160))
canvas.paste(hud, (card_x + pic_pad, card_y + pic_pad + pic_h - 54), hud)
draw.text((card_x + pic_pad + 20, card_y + pic_pad + pic_h - 40), "FRAME 01 / 05", font=f_hud, fill="#FFFFFF")
draw.text((card_x + pic_pad + pic_w - 240, card_y + pic_pad + pic_h - 40), "CLUE: 2018 JTBC", font=f_hud, fill="#FCD34D")

# Card bottom caption
draw.text((card_x + 30, card_y + pic_h + pic_pad + 32), "Scene #01 — Mystery Drama", font=ImageFont.truetype(FONT_BOLD, 28), fill="#1C1917")
draw.text((card_x + card_w - 280, card_y + pic_h + pic_pad + 32), "5 progressive stills", font=ImageFont.truetype(FONT_REG, 24), fill="#78716C")

# ── 4. Interactive Search Bar Mockup ──
bar_y = 1400
bar_w = 960
bar_x = (WIDTH - bar_w) // 2
draw.rounded_rectangle([bar_x, bar_y, bar_x + bar_w, bar_y + 100], radius=20, fill="#FFFFFF", outline="#D6D3D1", width=2)
draw.text((bar_x + 30, bar_y + 32), "🔍", font=ImageFont.truetype(FONT_REG, 34), fill="#78716C")
draw.text((bar_x + 95, bar_y + 34), "Enter a drama title...", font=f_pill, fill="#A8A29E")

btn_w, btn_h = 200, 76
btn_x = bar_x + bar_w - btn_w - 12
btn_y = bar_y + 12
draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], radius=14, fill="#DC2626")
t_btn = "Guess ➔"
b_bt = draw.textbbox((0, 0), t_btn, font=f_btn)
draw.text((btn_x + (btn_w - (b_bt[2]-b_bt[0])) // 2, btn_y + 20), t_btn, font=f_btn, fill="#FFFFFF")

# ── 5. Bottom Call to Action ──
draw.text(((WIDTH - 520) // 2, 1560), "PLAY TODAY'S ROUND FREE ON", font=f_badge, fill="#78716C")
draw.text(((WIDTH - 480) // 2, 1610), "hankut-psi.vercel.app", font=ImageFont.truetype(FONT_BOLD, 42), fill="#DC2626")
draw.text(((WIDTH - 180) // 2, 1675), "Link in bio 🍿", font=ImageFont.truetype(FONT_REG, 28), fill="#57534E")

canvas.save("out/hankut_aesthetic_thumbnail.png")
print("SUCCESS: Saved out/hankut_aesthetic_thumbnail.png")
