import os
import subprocess
import shutil
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = "scratch_ui_reel_frames"
os.makedirs(OUTPUT_DIR, exist_ok=True)

WIDTH, HEIGHT = 1080, 1920
FPS = 30

FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"

f_title = ImageFont.truetype(FONT_BOLD, 46)
f_h2 = ImageFont.truetype(FONT_BOLD, 42)
f_body = ImageFont.truetype(FONT_REG, 34)
f_body_bold = ImageFont.truetype(FONT_BOLD, 34)
f_hud = ImageFont.truetype(FONT_BOLD, 28)
f_small = ImageFont.truetype(FONT_REG, 26)
f_small_bold = ImageFont.truetype(FONT_BOLD, 26)
f_cta = ImageFont.truetype(FONT_BOLD, 52)
f_url = ImageFont.truetype(FONT_BOLD, 40)

# Load real DB frames (1400x912)
db_frames = [
    Image.open(f"real_db_frames/gangnam_beauty/frame-{i}.webp").convert("RGB")
    for i in range(1, 6)
]

TOTAL_SECONDS = 18
TOTAL_FRAMES = TOTAL_SECONDS * FPS

print(f"Rendering {TOTAL_FRAMES} frames of real Hankut UI gameplay...")

# Key events timeline (in seconds):
# 0.0 - 2.5: Frame 1 shown, typing "True Beauty"
# 2.5 - 3.5: Guess submitted -> WRONG! Shake animation -> Frame moves to 2
# 3.5 - 6.0: Frame 2 shown, typing "Weightlifting Fairy"
# 6.0 - 7.0: Guess submitted -> WRONG! Shake animation -> Frame moves to 3
# 7.0 - 9.5: Frame 3 shown, clue "2018 • JTBC" unlocks -> moves to Frame 4
# 9.5 - 12.0: Frame 4 shown! Typing "My ID is Gangnam Beauty"
# 12.0 - 14.5: Guess submitted -> CORRECT! Victory Card slides in (+80 pts)
# 14.5 - 18.0: Outro CTA card: "Play Today's Mystery Drama daily on Hankut!"

for f in range(TOTAL_FRAMES):
    t = f / FPS
    
    # Defaults
    current_frame_idx = 0
    input_text = ""
    is_shaking = False
    shake_offset = 0
    is_solved = False
    attempts = []
    clue_unlocked = False
    outro_active = False

    if t < 2.5:
        current_frame_idx = 0
        typed_str = "True Beauty"
        chars = int(min(len(typed_str), (t / 1.8) * len(typed_str)))
        input_text = typed_str[:chars]
    elif t < 3.5:
        current_frame_idx = 0
        input_text = "True Beauty"
        # Shake effect (2.5 - 3.0)
        if t < 3.0:
            is_shaking = True
            shake_offset = int(math.sin((t - 2.5) * 40) * 16)
        else:
            current_frame_idx = 1
            attempts = ["True Beauty"]
            input_text = ""
    elif t < 6.0:
        current_frame_idx = 1
        attempts = ["True Beauty"]
        typed_str = "Weightlifting Fairy"
        dt = t - 3.5
        chars = int(min(len(typed_str), (dt / 1.8) * len(typed_str)))
        input_text = typed_str[:chars]
    elif t < 7.0:
        current_frame_idx = 1
        attempts = ["True Beauty"]
        input_text = "Weightlifting Fairy"
        if t < 6.5:
            is_shaking = True
            shake_offset = int(math.sin((t - 6.0) * 40) * 16)
        else:
            current_frame_idx = 2
            attempts = ["True Beauty", "Weightlifting Fairy"]
            input_text = ""
    elif t < 9.5:
        current_frame_idx = 2
        attempts = ["True Beauty", "Weightlifting Fairy"]
        clue_unlocked = True
        input_text = ""
        if t > 8.2:
            current_frame_idx = 3
    elif t < 12.0:
        current_frame_idx = 3
        attempts = ["True Beauty", "Weightlifting Fairy"]
        clue_unlocked = True
        typed_str = "My ID is Gangnam Beauty"
        dt = t - 9.5
        chars = int(min(len(typed_str), (dt / 1.8) * len(typed_str)))
        input_text = typed_str[:chars]
    elif t < 14.5:
        current_frame_idx = 3
        attempts = ["True Beauty", "Weightlifting Fairy", "My ID is Gangnam Beauty"]
        clue_unlocked = True
        is_solved = True
    else:
        outro_active = True

    # Render Canvas
    canvas = Image.new("RGB", (WIDTH, HEIGHT), "#141210")
    draw = ImageDraw.Draw(canvas)

    if not outro_active:
        # ── 1. Top Navbar ──
        # Logo
        draw.ellipse([60, 100, 120, 160], fill="#E11D48")
        draw.text((78, 114), "컷", font=f_small_bold, fill="#FFFFFF")
        draw.text((135, 112), "Hankut", font=f_title, fill="#F5F5F4")
        draw.text((310, 122), "KOREAN CULTURE DAILY", font=f_small, fill="#78716C")

        # Top Right Badges
        draw.rounded_rectangle([720, 105, 1020, 155], radius=25, fill="#1C1917", outline="#292524", width=1)
        draw.text((750, 118), "🔥 1 Day Streak", font=f_small_bold, fill="#F59E0B")

        # Date Picker Pill
        date_pill_w = 640
        date_pill_x = (WIDTH - date_pill_w) // 2
        draw.rounded_rectangle([date_pill_x, 195, date_pill_x + date_pill_w, 245], radius=25, fill="#1C1917", outline="#292524", width=1)
        draw.text((date_pill_x + 30, 208), "<", font=f_small_bold, fill="#A8A29E")
        date_txt = "SUN, 27 SEPT 2026  •  TODAY"
        b_dt = draw.textbbox((0, 0), date_txt, font=f_small_bold)
        draw.text(((WIDTH - (b_dt[2] - b_dt[0])) // 2, 208), date_txt, font=f_small_bold, fill="#F5F5F4")
        draw.text((date_pill_x + date_pill_w - 45, 208), ">", font=f_small_bold, fill="#A8A29E")

        # ── 2. Scene Image Box (Real DB Frame) ──
        target_w, target_h = 960, 580
        box_x = (WIDTH - target_w) // 2 + (shake_offset if is_shaking else 0)
        box_y = 280

        src_frame = db_frames[current_frame_idx]
        frame_resized = src_frame.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        # Rounded frame border
        border_col = "#EF4444" if is_shaking else ("#10B981" if is_solved else "#292524")
        draw.rounded_rectangle([box_x - 3, box_y - 3, box_x + target_w + 3, box_y + target_h + 3], radius=16, outline=border_col, width=3)
        canvas.paste(frame_resized, (box_x, box_y))

        # HUD on image
        hud_bg = Image.new("RGBA", (target_w, 60), (0, 0, 0, 160))
        canvas.paste(hud_bg, (box_x, box_y + target_h - 60), hud_bg)
        draw.text((box_x + 24, box_y + target_h - 45), f"FRAME 0{current_frame_idx + 1} / 05", font=f_hud, fill="#FFFFFF")
        draw.text((box_x + target_w - 140, box_y + target_h - 45), f"{len(attempts)} / 5", font=f_hud, fill="#A8A29E")

        # ── 3. Frame Controls Row ──
        nav_y = 890
        draw.text((box_x + 10, nav_y), "< Prev cut", font=f_small, fill="#78716C")

        # Dots
        dot_spacing = 40
        dot_start = (WIDTH - (5 * dot_spacing)) // 2
        for i in range(5):
            dx = dot_start + (i * dot_spacing)
            d_fill = "#E11D48" if i <= current_frame_idx else "#44403C"
            draw.ellipse([dx, nav_y + 4, dx + 18, nav_y + 22], fill=d_fill)

        draw.text((box_x + target_w - 140, nav_y), "Next cut >", font=f_small, fill="#A8A29E")

        # ── 4. Guess Input Panel ──
        panel_y = 960
        draw.text((box_x, panel_y), "YOUR GUESS", font=f_small_bold, fill="#E11D48")
        draw.text((box_x, panel_y + 40), "What drama is this?", font=f_h2, fill="#FFFFFF")

        # Search Bar
        input_y = panel_y + 110
        input_h = 90
        input_border = "#EF4444" if is_shaking else ("#10B981" if is_solved else "#3F3F46")
        draw.rounded_rectangle([box_x, input_y, box_x + target_w, input_y + input_h], radius=16, fill="#1C1917", outline=input_border, width=2)
        
        # Magnifying glass / cursor
        draw.text((box_x + 28, input_y + 26), "🔍", font=f_body, fill="#78716C")
        if input_text:
            draw.text((box_x + 85, input_y + 26), input_text, font=f_body_bold, fill="#FFFFFF")
        else:
            draw.text((box_x + 85, input_y + 26), "Enter a drama title...", font=f_body, fill="#78716C")

        # Guess Button inside search
        btn_w, btn_h = 160, 66
        btn_x = box_x + target_w - btn_w - 12
        btn_y = input_y + 12
        btn_col = "#E11D48" if input_text else "#292524"
        draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], radius=12, fill=btn_col)
        draw.text((btn_x + 40, btn_y + 16), "Guess", font=f_small_bold, fill="#FFFFFF")

        # ── 5. Clues Row ──
        clue_y = input_y + 120
        clue_w = (target_w - 20) // 2
        # Clue 1: Year
        draw.rounded_rectangle([box_x, clue_y, box_x + clue_w, clue_y + 80], radius=12, fill="#1C1917", outline="#292524", width=1)
        draw.text((box_x + 20, clue_y + 14), "YEAR CLUE", font=f_small, fill="#78716C")
        draw.text((box_x + 20, clue_y + 44), "2018 (JTBC)" if clue_unlocked else "🔒 Unlock on frame 3", font=f_small_bold, fill="#10B981" if clue_unlocked else "#78716C")

        # Clue 2: Genre
        draw.rounded_rectangle([box_x + clue_w + 20, clue_y, box_x + target_w, clue_y + 80], radius=12, fill="#1C1917", outline="#292524", width=1)
        draw.text((box_x + clue_w + 40, clue_y + 14), "GENRE", font=f_small, fill="#78716C")
        draw.text((box_x + clue_w + 40, clue_y + 44), "Romance / Youth / College" if clue_unlocked else "🔒 Locked", font=f_small_bold, fill="#10B981" if clue_unlocked else "#78716C")

        # ── 6. Attempts List or Victory Reveal ──
        attempts_y = clue_y + 110
        if is_solved:
            # Gorgeous Victory Result Card
            card_h = 320
            draw.rounded_rectangle([box_x, attempts_y, box_x + target_w, attempts_y + card_h], radius=20, fill="#18181B", outline="#10B981", width=3)
            
            draw.text((box_x + 30, attempts_y + 30), "🎉 PUZZLE SOLVED!", font=f_h2, fill="#10B981")
            draw.text((box_x + 30, attempts_y + 90), "My ID is Gangnam Beauty", font=f_title, fill="#FFFFFF")
            draw.text((box_x + 30, attempts_y + 148), "내 아이디는 강남미인 (2018)", font=f_body, fill="#A8A29E")

            # Score block
            draw.rounded_rectangle([box_x + 30, attempts_y + 205, box_x + 320, attempts_y + 285], radius=12, fill="#064E3B")
            draw.text((box_x + 50, attempts_y + 215), "SCORE", font=f_small, fill="#6EE7B7")
            draw.text((box_x + 50, attempts_y + 242), "+80 PTS (3/5)", font=f_h2, fill="#FFFFFF")

            # Streak block
            draw.rounded_rectangle([box_x + 350, attempts_y + 205, box_x + 640, attempts_y + 285], radius=12, fill="#292524")
            draw.text((box_x + 370, attempts_y + 215), "STREAK", font=f_small, fill="#A8A29E")
            draw.text((box_x + 370, attempts_y + 242), "🔥 2 DAYS", font=f_h2, fill="#F59E0B")
        else:
            for idx, att in enumerate(attempts):
                ay = attempts_y + (idx * 68)
                draw.rounded_rectangle([box_x, ay, box_x + target_w, ay + 56], radius=12, fill="#1C1917", outline="#292524", width=1)
                draw.text((box_x + 20, ay + 14), f"0{idx+1}", font=f_small, fill="#EF4444")
                draw.text((box_x + 70, ay + 14), att, font=f_small_bold, fill="#FFFFFF")
                draw.text((box_x + target_w - 60, ay + 14), "❌", font=f_small, fill="#EF4444")

        # Bottom watermark
        draw.text(((WIDTH - 380) // 2, 1780), "PLAY TODAY'S ROUND AT HANKUT 🍿", font=f_small_bold, fill="#78716C")

    else:
        # Outro Screen with CTA
        card_w, card_h = 960, 1000
        card_x = (WIDTH - card_w) // 2
        card_y = (HEIGHT - card_h) // 2
        draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=32, fill="#18181B", outline="#E11D48", width=4)

        t1 = "CAN YOU GUESS IN 1 FRAME? 🎬"
        b1 = draw.textbbox((0, 0), t1, font=f_cta)
        draw.text(((WIDTH - (b1[2]-b1[0])) // 2, card_y + 110), t1, font=f_cta, fill="#FFFFFF")

        t2 = "Every day, a new mystery K-drama scene drops."
        b2 = draw.textbbox((0, 0), t2, font=f_body)
        draw.text(((WIDTH - (b2[2]-b2[0])) // 2, card_y + 210), t2, font=f_body, fill="#A8A29E")

        # Logo Icon & Brand
        draw.ellipse([(WIDTH - 120) // 2, card_y + 320, (WIDTH + 120) // 2, card_y + 440], fill="#E11D48")
        draw.text(((WIDTH - 44) // 2, card_y + 355), "컷", font=ImageFont.truetype(FONT_BOLD, 48), fill="#FFFFFF")

        t_brand = "Hankut (한컷)"
        b_brand = draw.textbbox((0, 0), t_brand, font=ImageFont.truetype(FONT_BOLD, 64))
        draw.text(((WIDTH - (b_brand[2]-b_brand[0])) // 2, card_y + 480), t_brand, font=ImageFont.truetype(FONT_BOLD, 64), fill="#FFFFFF")

        t_sub = "Daily K-Drama Scene Guessing Game"
        b_sub = draw.textbbox((0, 0), t_sub, font=f_body)
        draw.text(((WIDTH - (b_sub[2]-b_sub[0])) // 2, card_y + 570), t_sub, font=f_body, fill="#E4E4E7")

        # Launch Button
        btn_w, btn_h = 760, 110
        btn_x = (WIDTH - btn_w) // 2
        btn_y = card_y + 680
        draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], radius=22, fill="#E11D48")
        b_text = "Play Today's Mystery Drama"
        b_bt = draw.textbbox((0, 0), b_text, font=f_h2)
        draw.text(((WIDTH - (b_bt[2]-b_bt[0])) // 2, btn_y + 30), b_text, font=f_h2, fill="#FFFFFF")

        t_url = "👉 hankut-psi.vercel.app"
        b_url = draw.textbbox((0, 0), t_url, font=f_url)
        draw.text(((WIDTH - (b_url[2]-b_url[0])) // 2, card_y + 840), t_url, font=f_url, fill="#E11D48")

        t_bio = "(Link in bio 🍿)"
        b_bio = draw.textbbox((0, 0), t_bio, font=f_small_bold)
        draw.text(((WIDTH - (b_bio[2]-b_bio[0])) // 2, card_y + 910), t_bio, font=f_small_bold, fill="#78716C")

    frame_path = os.path.join(OUTPUT_DIR, f"frame_{f:04d}.png")
    canvas.save(frame_path)

print("Frames rendered! Compiling final MP4 with ffmpeg...")
cmd = [
    "ffmpeg", "-y",
    "-framerate", str(FPS),
    "-i", os.path.join(OUTPUT_DIR, "frame_%04d.png"),
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-crf", "18",
    "hankut_gameplay_reel.mp4"
]
subprocess.run(cmd, check=True)
shutil.rmtree(OUTPUT_DIR)
print("SUCCESS: Generated hankut_gameplay_reel.mp4")
