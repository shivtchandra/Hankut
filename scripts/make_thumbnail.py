from PIL import Image, ImageDraw, ImageFont, ImageFilter

WIDTH, HEIGHT = 1080, 1920

FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"

f_huge = ImageFont.truetype(FONT_BOLD, 78)
f_sub = ImageFont.truetype(FONT_BOLD, 46)
f_hud = ImageFont.truetype(FONT_BOLD, 28)
f_brand = ImageFont.truetype(FONT_BOLD, 32)
f_btn = ImageFont.truetype(FONT_BOLD, 44)

# Load real Frame 1
frame1 = Image.open("real_db_frames/gangnam_beauty/frame-1.webp").convert("RGB")

canvas = Image.new("RGB", (WIDTH, HEIGHT), "#0D0C0B")

# Cinematic blurred background from frame 1
bg = frame1.resize((WIDTH, int(WIDTH * 9 / 16)), Image.Resampling.LANCZOS)
bg = bg.resize((WIDTH, HEIGHT), Image.Resampling.NEAREST)
bg = bg.filter(ImageFilter.GaussianBlur(radius=65))
dimmer = Image.new("RGBA", (WIDTH, HEIGHT), (12, 10, 9, 215))
canvas.paste(bg, (0, 0))
canvas.paste(dimmer, (0, 0), dimmer)

draw = ImageDraw.Draw(canvas)

# 1. Top Brand Pill
draw.rounded_rectangle([360, 180, 720, 244], radius=32, fill="#1C1917", outline="#DC2626", width=2)
brand_txt = "HANKUT DAILY PUZZLE"
b_br = draw.textbbox((0, 0), brand_txt, font=f_brand)
draw.text(((WIDTH - (b_br[2] - b_br[0])) // 2, 195), brand_txt, font=f_brand, fill="#FFFFFF")

# 2. Main High-CTR Hook Text
t1 = "ONLY 5% GUESS THIS"
b1 = draw.textbbox((0, 0), t1, font=f_huge)
draw.text(((WIDTH - (b1[2]-b1[0])) // 2, 310), t1, font=f_huge, fill="#FFFFFF")

t2 = "ON FRAME 1"
b2 = draw.textbbox((0, 0), t2, font=f_huge)
draw.text(((WIDTH - (b2[2]-b2[0])) // 2, 400), t2, font=f_huge, fill="#DC2626")

# 3. Main Mystery Frame Box
target_w, target_h = 960, 580
box_x = (WIDTH - target_w) // 2
box_y = 540

frame_resized = frame1.resize((target_w, target_h), Image.Resampling.LANCZOS)

# Outer glow/border
draw.rounded_rectangle([box_x - 6, box_y - 6, box_x + target_w + 6, box_y + target_h + 6], radius=20, outline="#DC2626", width=5)
canvas.paste(frame_resized, (box_x, box_y))

# HUD on Image
hud_bg = Image.new("RGBA", (target_w, 64), (0, 0, 0, 175))
canvas.paste(hud_bg, (box_x, box_y + target_h - 64), hud_bg)
draw.text((box_x + 28, box_y + target_h - 48), "FRAME 01 / 05  •  CLUE: 2018 JTBC", font=f_hud, fill="#FFFFFF")
draw.text((box_x + target_w - 260, box_y + target_h - 48), "DIFFICULTY: HARD", font=f_hud, fill="#F59E0B")

# 4. Challenge Question Below Image
q_box_y = 1180
draw.rounded_rectangle([100, q_box_y, WIDTH - 100, q_box_y + 180], radius=24, fill="#1C1917", outline="#292524", width=2)

t_q = "Can you name this K-Drama?"
b_q = draw.textbbox((0, 0), t_q, font=f_sub)
draw.text(((WIDTH - (b_q[2]-b_q[0])) // 2, q_box_y + 36), t_q, font=f_sub, fill="#FFFFFF")

t_subq = "5 progressive stills  •  Click to play"
b_subq = draw.textbbox((0, 0), t_subq, font=ImageFont.truetype(FONT_REG, 32))
draw.text(((WIDTH - (b_subq[2]-b_subq[0])) // 2, q_box_y + 104), t_subq, font=ImageFont.truetype(FONT_REG, 32), fill="#A8A29E")

# 5. Play Button Banner at Bottom
btn_y = 1430
btn_w = 780
btn_x = (WIDTH - btn_w) // 2
draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_w, btn_y + 110], radius=22, fill="#DC2626")
t_btn = "GUESS THE DRAMA"
b_btn = draw.textbbox((0, 0), t_btn, font=f_btn)
draw.text(((WIDTH - (b_btn[2]-b_btn[0])) // 2, btn_y + 30), t_btn, font=f_btn, fill="#FFFFFF")

# URL at the bottom
draw.text(((WIDTH - 380) // 2, 1620), "hankut-psi.vercel.app", font=ImageFont.truetype(FONT_BOLD, 34), fill="#E4E4E7")

canvas.save("out/hankut_thumbnail.png")
print("SUCCESS: Updated out/hankut_thumbnail.png")
