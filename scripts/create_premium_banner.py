import math
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_premium_banner():
    # 2x supersampling: 3168 x 792 -> downscaled to 1584 x 396
    scale = 2
    w, h = 1584 * scale, 396 * scale

    # 1. Base canvas: Deep Obsidian Black
    canvas = Image.new("RGBA", (w, h), (3, 7, 18, 255))
    draw = ImageDraw.Draw(canvas)

    # Subtle vertical gradient: #030712 to #070d1d
    for y in range(h):
        ratio = y / h
        r = int(3 + 5 * ratio)
        g = int(7 + 7 * ratio)
        b = int(18 + 14 * ratio)
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))

    # 2. Cinematic Ethereal Aurora Glow (Upper right quadrant)
    aurora = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    a_draw = ImageDraw.Draw(aurora)

    # Core cyan flare
    a_draw.ellipse([w - 900 * scale, -180 * scale, w + 100 * scale, 320 * scale], fill=(6, 182, 212, 55))
    # Deep indigo/violet ambient aura
    a_draw.ellipse([w - 1200 * scale, -250 * scale, w - 100 * scale, 380 * scale], fill=(99, 102, 241, 45))
    # Neon emerald subtle horizon streak
    a_draw.ellipse([w - 650 * scale, 80 * scale, w + 150 * scale, 480 * scale], fill=(16, 185, 129, 35))
    # Soft sapphire flare behind avatar
    a_draw.ellipse([-150 * scale, -100 * scale, 450 * scale, 450 * scale], fill=(30, 58, 138, 28))

    # Heavy Gaussian blur creates a silky smooth luxury keynote glow
    aurora = aurora.filter(ImageFilter.GaussianBlur(90 * scale))
    canvas = Image.alpha_composite(canvas, aurora)

    # 3. Microscopic Texture: Fine luminous accent lines (Horizontal beam & laser line)
    beam_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(beam_layer)

    # Single elegant glowing horizon rule across the banner
    horizon_y = int(35 * scale)
    for i in range(12 * scale):
        alpha = int(40 * (1 - i / (12 * scale)))
        b_draw.line([(w - 1100 * scale, horizon_y - i), (w - 60 * scale, horizon_y - i)], fill=(56, 189, 248, alpha))
        b_draw.line([(w - 1100 * scale, horizon_y + i), (w - 60 * scale, horizon_y + i)], fill=(56, 189, 248, alpha))
    b_draw.line([(w - 1100 * scale, horizon_y), (w - 60 * scale, horizon_y)], fill=(255, 255, 255, 180), width=1 * scale)

    # Ultra-subtle, elegant geometric accent in top-right
    top_rx = w - 100 * scale
    top_ry = 50 * scale
    b_draw.ellipse([top_rx - 12 * scale, top_ry - 12 * scale, top_rx + 12 * scale, top_ry + 12 * scale], outline=(56, 189, 248, 120), width=1 * scale)
    b_draw.ellipse([top_rx - 4 * scale, top_ry - 4 * scale, top_rx + 4 * scale, top_ry + 4 * scale], fill=(56, 189, 248, 200))

    canvas = Image.alpha_composite(canvas, beam_layer)
    draw = ImageDraw.Draw(canvas)

    # 4. Fonts
    # Bahnschrift (DIN 1451) for sleek engineering titles
    font_eyebrow = ImageFont.truetype("C:/Windows/Fonts/bahnschrift.ttf", 15 * scale)
    font_name = ImageFont.truetype("C:/Windows/Fonts/bahnschrift.ttf", 54 * scale)
    font_tagline = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 20 * scale)
    font_dock = ImageFont.truetype("C:/Windows/Fonts/bahnschrift.ttf", 15 * scale)
    font_dock_sub = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 13 * scale)

    # Content starting X: preserve left 410px (820px at 2x) for avatar safety
    start_x = 425 * scale

    # 5. Eyebrow: Glowing dot + Tracked-out category
    eyebrow_y = 65 * scale
    # Glowing neon cyan pulse dot
    draw.ellipse([start_x, eyebrow_y + 4 * scale, start_x + 9 * scale, eyebrow_y + 13 * scale], fill=(56, 189, 248, 255))
    draw.ellipse([start_x - 3 * scale, eyebrow_y + 1 * scale, start_x + 12 * scale, eyebrow_y + 16 * scale], outline=(56, 189, 248, 90), width=1 * scale)

    # Helper function for letter-spaced text
    def draw_tracked_text(draw_ctx, pos, text, font, fill, spacing=3 * scale):
        cur_x, cur_y = pos
        for ch in text:
            draw_ctx.text((cur_x, cur_y), ch, font=font, fill=fill)
            bbox = font.getbbox(ch)
            cur_x += (bbox[2] - bbox[0]) + spacing

    draw_tracked_text(
        draw,
        (start_x + 20 * scale, eyebrow_y),
        "FULL-STACK SOFTWARE ENGINEER   /   AI SYSTEMS ARCHITECT",
        font_eyebrow,
        (56, 189, 248, 240),
        spacing=4 * scale
    )

    # 6. Main Headline: RAJASHEKHAR AMARAPPAGOL
    name_y = 100 * scale
    # Drop shadow for depth
    draw.text((start_x + 1 * scale, name_y + 2 * scale), "RAJASHEKHAR AMARAPPAGOL", font=font_name, fill=(0, 0, 0, 160))
    # Crisp white name
    draw.text((start_x, name_y), "RAJASHEKHAR AMARAPPAGOL", font=font_name, fill=(255, 255, 255, 255))

    # 7. Editorial Subheadline
    sub_y = 175 * scale
    sub_text = "Engineering reactive web platforms, 3D interactive environments & real-time architectures."
    draw.text((start_x, sub_y), sub_text, font=font_tagline, fill=(148, 163, 184, 255))

    # 8. Single Unified Frosted Glass Dock (Instead of 12 messy boxes)
    dock_y = 240 * scale
    dock_h = 74 * scale
    dock_w = w - start_x - 70 * scale

    # Frosted glass background
    dock_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d_draw = ImageDraw.Draw(dock_layer)

    d_draw.rounded_rectangle(
        [start_x, dock_y, start_x + dock_w, dock_y + dock_h],
        radius=12 * scale,
        fill=(15, 23, 42, 190),
        outline=(56, 189, 248, 70),
        width=1 * scale
    )
    # Subtle top edge highlight (Apple glassmorphism trick)
    d_draw.line(
        [(start_x + 15 * scale, dock_y + 1 * scale), (start_x + dock_w - 15 * scale, dock_y + 1 * scale)],
        fill=(255, 255, 255, 70),
        width=1 * scale
    )
    canvas = Image.alpha_composite(canvas, dock_layer)
    draw = ImageDraw.Draw(canvas)

    # 4 distinct, spaced credentials inside the unified dock
    items = [
        {
            "badge": "MICROSOFT CERTIFIED",
            "val": "Azure AI Apps & Agents Associate",
            "color": (56, 189, 248, 255)
        },
        {
            "badge": "IEEE AWARDS",
            "val": "2nd Place GAMEATHON · AI Arena 2.0",
            "color": (245, 158, 11, 255)
        },
        {
            "badge": "PRODUCTION SYSTEM",
            "val": "kadmultiplier.in (Live E-Comm)",
            "color": (16, 185, 129, 255)
        },
        {
            "badge": "PORTFOLIO & STACK",
            "val": "rajashekhar.pages.dev · React/TS",
            "color": (168, 85, 247, 255)
        }
    ]

    col_w = dock_w // 4
    for i, it in enumerate(items):
        item_x = start_x + i * col_w + 20 * scale

        # Subtle vertical separator between columns
        if i > 0:
            draw.line(
                [(start_x + i * col_w, dock_y + 16 * scale), (start_x + i * col_w, dock_y + dock_h - 16 * scale)],
                fill=(51, 65, 85, 120),
                width=1 * scale
            )

        # Indicator dot
        dot_y = dock_y + 18 * scale
        draw.ellipse([item_x, dot_y + 3 * scale, item_x + 6 * scale, dot_y + 9 * scale], fill=it["color"])

        # Category eyebrow
        draw.text((item_x + 12 * scale, dot_y), it["badge"], font=font_dock, fill=it["color"])

        # Value text
        draw.text((item_x, dock_y + 40 * scale), it["val"], font=font_dock_sub, fill=(226, 232, 240, 255))

    # Downscale from 2x (3168x792) to 1584x396 with Lanczos filter for Retina crispness
    final = canvas.resize((1584, 396), Image.Resampling.LANCZOS)

    out_dl = "C:/Users/Rajashekhar/Downloads/rajashekhar_linkedin_banner_premium.png"
    out_ws = "C:/Projects/premium-portfolio/public/rajashekhar_linkedin_banner_premium.png"
    final.save(out_dl, format="PNG", optimize=True)
    final.save(out_ws, format="PNG", optimize=True)
    print("Premium banner generated successfully!")

if __name__ == "__main__":
    create_premium_banner()
