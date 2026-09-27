import os
import subprocess
import shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = "scratch_reel_frames"
os.makedirs(OUTPUT_DIR, exist_ok=True)

WIDTH, HEIGHT = 1080, 1920
FPS = 30

FONT_PATH_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_PATH_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"

font_header = ImageFont.truetype(FONT_PATH_BOLD, 52)
font_sub = ImageFont.truetype(FONT_PATH_BOLD, 38)
font_badge = ImageFont.truetype(FONT_PATH_BOLD, 32)
font_hint = ImageFont.truetype(FONT_PATH_REG, 36)
font_cta_large = ImageFont.truetype(FONT_PATH_BOLD, 64)
font_cta_url = ImageFont.truetype(FONT_PATH_BOLD, 46)

FRAME_PATHS = [
    "extracted_frames/twenty-five-twenty-one/frame-1.jpg",
    "extracted_frames/twenty-five-twenty-one/frame-2.jpg",
    "extracted_frames/twenty-five-twenty-one/frame-3.jpg",
    "extracted_frames/twenty-five-twenty-one/frame-4.jpg",
    "extracted_frames/twenty-five-twenty-one/frame-5.jpg",
]

HINTS = [
    "CLUE 1/5: 2022 • Coming-of-age / Romance",
    "CLUE 2/5: A familiar interior... 🤔",
    "CLUE 3/5: Spot this setting? 👀",
    "CLUE 4/5: You should definitely know it now! 🍿",
    "CLUE 5/5: Final reveal shot! Did you get it? 🔥",
]

# Timeline definition in seconds:
# Frame 1: 0 - 3s (90 frames)
# Frame 2: 3 - 5.5s (75 frames)
# Frame 3: 5.5 - 8s (75 frames)
# Frame 4: 8 - 10.5s (75 frames)
# Frame 5: 10.5 - 13s (75 frames)
# Outro / CTA: 13 - 16s (90 frames)
TOTAL_SECONDS = 16
TOTAL_FRAMES = TOTAL_SECONDS * FPS

frame_idx = 0
print(f"Generating {TOTAL_FRAMES} video frames at {FPS} FPS...")

for f in range(TOTAL_FRAMES):
    time_sec = f / FPS
    
    # Determine stage
    if time_sec < 3.0:
        stage = 0
        stage_time = time_sec
        stage_duration = 3.0
    elif time_sec < 5.5:
        stage = 1
        stage_time = time_sec - 3.0
        stage_duration = 2.5
    elif time_sec < 8.0:
        stage = 2
        stage_time = time_sec - 5.5
        stage_duration = 2.5
    elif time_sec < 10.5:
        stage = 3
        stage_time = time_sec - 8.0
        stage_duration = 2.5
    elif time_sec < 13.0:
        stage = 4
        stage_time = time_sec - 10.5
        stage_duration = 2.5
    else:
        stage = 5  # Outro CTA
        stage_time = time_sec - 13.0
        stage_duration = 3.0

    img = Image.new("RGB", (WIDTH, HEIGHT), "#0f0d0c")
    draw = ImageDraw.Draw(img)

    if stage < 5:
        # Load active scene photo
        source_frame = Image.open(FRAME_PATHS[stage]).convert("RGB")
        
        # Blurred background
        bg = source_frame.resize((WIDTH, int(WIDTH * 9 / 16)), Image.Resampling.LANCZOS)
        bg = bg.resize((WIDTH, HEIGHT), Image.Resampling.NEAREST)
        bg = bg.filter(ImageFilter.GaussianBlur(radius=55))
        # Dim background
        dimmer = Image.new("RGBA", (WIDTH, HEIGHT), (10, 10, 12, 185))
        img.paste(bg, (0, 0))
        img.paste(dimmer, (0, 0), dimmer)
        draw = ImageDraw.Draw(img)

        # Header Badge
        header_text = "🎬 GUESS THE K-DRAMA"
        bbox = draw.textbbox((0, 0), header_text, font=font_header)
        text_w = bbox[2] - bbox[0]
        draw.text(((WIDTH - text_w) // 2, 220), header_text, font=font_header, fill="#FFFFFF")

        sub_text = "Can you name it from 5 frames?"
        bbox_sub = draw.textbbox((0, 0), sub_text, font=font_sub)
        sub_w = bbox_sub[2] - bbox_sub[0]
        draw.text(((WIDTH - sub_w) // 2, 290), sub_text, font=font_sub, fill="#F43F5E")

        # Frame Indicator Dots
        dot_y = 380
        total_dots = 5
        dot_spacing = 50
        start_x = (WIDTH - (total_dots * dot_spacing)) // 2
        for d in range(total_dots):
            dx = start_x + d * dot_spacing
            if d <= stage:
                draw.ellipse([dx, dot_y, dx + 26, dot_y + 26], fill="#F43F5E")
            else:
                draw.ellipse([dx, dot_y, dx + 26, dot_y + 26], fill="#52525B")

        # Main Picture in Center (W: 960, H: 540)
        target_w, target_h = 960, 540
        pic = source_frame.resize((target_w, target_h), Image.Resampling.LANCZOS)
        pic_x = (WIDTH - target_w) // 2
        pic_y = 520

        # Border / shadow
        draw.rounded_rectangle([pic_x - 4, pic_y - 4, pic_x + target_w + 4, pic_y + target_h + 4], radius=16, outline="#F43F5E", width=4)
        img.paste(pic, (pic_x, pic_y))

        # Bottom Hint Bar
        hint_text = HINTS[stage]
        bbox_h = draw.textbbox((0, 0), hint_text, font=font_hint)
        hint_w = bbox_h[2] - bbox_h[0]
        
        # Pill behind hint
        pill_pad_x, pill_pad_y = 30, 14
        pill_x1 = (WIDTH - hint_w) // 2 - pill_pad_x
        pill_y1 = 1140
        pill_x2 = pill_x1 + hint_w + (pill_pad_x * 2)
        pill_y2 = pill_y1 + 50
        draw.rounded_rectangle([pill_x1, pill_y1, pill_x2, pill_y2], radius=25, fill="#1C1917", outline="#3F3F46", width=2)
        draw.text(((WIDTH - hint_w) // 2, pill_y1 + 6), hint_text, font=font_hint, fill="#E4E4E7")

        # Progress Countdown Bar
        bar_w = 700
        bar_h = 10
        bar_x = (WIDTH - bar_w) // 2
        bar_y = 1240
        draw.rounded_rectangle([bar_x, bar_y, bar_x + bar_w, bar_y + bar_h], radius=5, fill="#27272A")
        fill_ratio = max(0.0, min(1.0, 1.0 - (stage_time / stage_duration)))
        current_fill_w = int(bar_w * fill_ratio)
        if current_fill_w > 0:
            draw.rounded_rectangle([bar_x, bar_y, bar_x + current_fill_w, bar_y + bar_h], radius=5, fill="#F43F5E")

        # CTA question at bottom
        q_text = "Drop your guess in the comments! 👇"
        bbox_q = draw.textbbox((0, 0), q_text, font=font_sub)
        qw = bbox_q[2] - bbox_q[0]
        draw.text(((WIDTH - qw) // 2, 1450), q_text, font=font_sub, fill="#A1A1AA")

        watermark = "PLAY DAILY AT HANKUT 🍿"
        bbox_wm = draw.textbbox((0, 0), watermark, font=font_badge)
        wm_w = bbox_wm[2] - bbox_wm[0]
        draw.text(((WIDTH - wm_w) // 2, 1720), watermark, font=font_badge, fill="#71717A")

    else:
        # Outro screen
        card_w, card_h = 920, 960
        card_x = (WIDTH - card_w) // 2
        card_y = (HEIGHT - card_h) // 2
        draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=32, fill="#18181B", outline="#F43F5E", width=4)

        t1 = "DID YOU GUESS IT? 🎬"
        b1 = draw.textbbox((0, 0), t1, font=font_cta_large)
        draw.text(((WIDTH - (b1[2]-b1[0])) // 2, card_y + 120), t1, font=font_cta_large, fill="#FFFFFF")

        t2 = "Comment which frame gave it away!"
        b2 = draw.textbbox((0, 0), t2, font=font_hint)
        draw.text(((WIDTH - (b2[2]-b2[0])) // 2, card_y + 220), t2, font=font_hint, fill="#A1A1AA")

        # Drama logo / brand
        t3 = "HANKUT"
        b3 = draw.textbbox((0, 0), t3, font=ImageFont.truetype(FONT_PATH_BOLD, 88))
        draw.text(((WIDTH - (b3[2]-b3[0])) // 2, card_y + 360), t3, font=ImageFont.truetype(FONT_PATH_BOLD, 88), fill="#F43F5E")

        t4 = "Daily K-Drama Scene Guessing Game"
        b4 = draw.textbbox((0, 0), t4, font=font_sub)
        draw.text(((WIDTH - (b4[2]-b4[0])) // 2, card_y + 480), t4, font=font_sub, fill="#E4E4E7")

        # Button Box
        btn_w, btn_h = 720, 110
        btn_x = (WIDTH - btn_w) // 2
        btn_y = card_y + 600
        draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], radius=20, fill="#F43F5E")
        btn_text = "Play Today's Mystery Drama"
        b_btn = draw.textbbox((0, 0), btn_text, font=font_sub)
        draw.text(((WIDTH - (b_btn[2]-b_btn[0])) // 2, btn_y + 32), btn_text, font=font_sub, fill="#FFFFFF")

        url_text = "👉 hankut-psi.vercel.app"
        b_url = draw.textbbox((0, 0), url_text, font=font_cta_url)
        draw.text(((WIDTH - (b_url[2]-b_url[0])) // 2, card_y + 780), url_text, font=font_cta_url, fill="#F43F5E")

        bio_text = "(Link in bio 🔗)"
        b_bio = draw.textbbox((0, 0), bio_text, font=font_hint)
        draw.text(((WIDTH - (b_bio[2]-b_bio[0])) // 2, card_y + 850), bio_text, font=font_hint, fill="#71717A")

    frame_path = os.path.join(OUTPUT_DIR, f"frame_{f:04d}.png")
    img.save(frame_path)

print("Frames rendered! Compiling MP4 video with ffmpeg...")
cmd = [
    "ffmpeg", "-y",
    "-framerate", str(FPS),
    "-i", os.path.join(OUTPUT_DIR, "frame_%04d.png"),
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-crf", "18",
    "hankut_reel.mp4"
]
subprocess.run(cmd, check=True)

# Cleanup frames
shutil.rmtree(OUTPUT_DIR)
print("SUCCESS: Generated hankut_reel.mp4")
