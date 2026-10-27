import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_banner():
    # 2x supersampling for razor-sharp antialiasing
    scale = 2
    w, h = 1584 * scale, 396 * scale

    # 1. Base canvas: deep obsidian gradient
    base = Image.new("RGBA", (w, h), (8, 12, 20, 255))
    draw = ImageDraw.Draw(base)

    # Gradient background
    for y in range(h):
        ratio = y / h
        # Dark obsidian navy gradient
        r = int(8 + (14 - 8) * ratio)
        g = int(12 + (20 - 12) * ratio)
        b = int(22 + (34 - 22) * ratio)
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))

    # 2. Glowing Ambient Orbs (Cyan & Emerald)
    glow_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)

    # Top right cyan glow
    glow_draw.ellipse([w - 600 * scale, -200 * scale, w + 200 * scale, 400 * scale], fill=(0, 210, 255, 35))
    # Bottom right emerald glow
    glow_draw.ellipse([w - 800 * scale, 150 * scale, w + 100 * scale, 550 * scale], fill=(16, 185, 129, 30))
    # Mid-left subtle purple glow (behind avatar)
    glow_draw.ellipse([-100 * scale, -50 * scale, 400 * scale, 450 * scale], fill=(124, 58, 237, 25))

    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(80 * scale))
    base = Image.alpha_composite(base, glow_layer)
    draw = ImageDraw.Draw(base)

    # 3. Subtle Cyber Grid Lines
    grid_color = (255, 255, 255, 8)
    grid_step = 40 * scale
    for x in range(0, w, grid_step):
        draw.line([(x, 0), (x, h)], fill=grid_color, width=1)
    for y in range(0, h, grid_step):
        draw.line([(0, y), (w, y)], fill=grid_color, width=1)

    # 4. Fonts
    font_bold = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 46 * scale)
    font_semi = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 22 * scale)
    font_mono = ImageFont.truetype("C:/Windows/Fonts/consolab.ttf", 15 * scale)
    font_tag = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 13 * scale)
    font_small = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 14 * scale)

    # Left boundary for content: safe zone for profile avatar is x < 380px (760px in 2x)
    start_x = 420 * scale

    # 5. Top Terminal Badge / Command Pill
    # Draw dark translucent pill
    pill_y = 52 * scale
    pill_text = "rajashekhar@dev ~ $ whoami"
    bbox = font_mono.getbbox(pill_text)
    pw = (bbox[2] - bbox[0]) + 44 * scale
    ph = 28 * scale

    # Pill background
    draw.rounded_rectangle(
        [start_x, pill_y, start_x + pw, pill_y + ph],
        radius=14 * scale,
        fill=(18, 26, 42, 220),
        outline=(56, 189, 248, 80),
        width=1 * scale
    )
    # Terminal lights
    draw.ellipse([start_x + 12 * scale, pill_y + 10 * scale, start_x + 18 * scale, pill_y + 16 * scale], fill=(16, 185, 129, 255))
    # Text
    draw.text((start_x + 28 * scale, pill_y + 5 * scale), pill_text, font=font_mono, fill=(56, 189, 248, 255))

    # 6. Primary Name
    name_y = 96 * scale
    draw.text((start_x, name_y), "RAJASHEKHAR AMARAPPAGOL", font=font_bold, fill=(255, 255, 255, 255))

    # 7. Role / Subtitle
    sub_y = 158 * scale
    draw.text(
        (start_x, sub_y),
        "Full-Stack Web Developer  ·  Microsoft Certified Azure AI Builder",
        font=font_semi,
        fill=(148, 163, 184, 255)
    )

    # 8. Tech Stack Badges
    tech_tags = ["React.js", "TypeScript", "Next.js", "Firebase", "MongoDB", "Three.js", "Tailwind CSS"]
    tag_x = start_x
    tag_y = 205 * scale
    tag_h = 26 * scale

    for tag in tech_tags:
        t_box = font_tag.getbbox(tag)
        t_w = (t_box[2] - t_box[0]) + 20 * scale
        draw.rounded_rectangle(
            [tag_x, tag_y, tag_x + t_w, tag_y + tag_h],
            radius=6 * scale,
            fill=(15, 23, 42, 180),
            outline=(51, 65, 85, 200),
            width=1 * scale
        )
        draw.text((tag_x + 10 * scale, tag_y + 4 * scale), tag, font=font_tag, fill=(203, 213, 225, 255))
        tag_x += t_w + 10 * scale

    # 9. Proof Points / Highlights Row (Cards at bottom)
    card_y = 255 * scale
    card_h = 76 * scale

    cards = [
        {
            "icon": "VERIFIED",
            "title": "Microsoft Certified",
            "sub": "Azure AI Apps & Agents Associate",
            "accent": (0, 120, 212, 255)
        },
        {
            "icon": "AWARD",
            "title": "2nd Place Runner-Up",
            "sub": "IEEE GAMEATHON · 2026",
            "accent": (245, 158, 11, 255)
        },
        {
            "icon": "PRODUCTION",
            "title": "kadmultiplier.in",
            "sub": "Live Agricultural E-Commerce",
            "accent": (16, 185, 129, 255)
        },
        {
            "icon": "PORTFOLIO",
            "title": "rajashekhar.pages.dev",
            "sub": "Interactive 3D Web Platform",
            "accent": (0, 210, 255, 255)
        }
    ]

    card_w = (w - start_x - (50 * scale) - (3 * 16 * scale)) // 4
    c_x = start_x

    for c in cards:
        # Card container
        draw.rounded_rectangle(
            [c_x, card_y, c_x + card_w, card_y + card_h],
            radius=10 * scale,
            fill=(15, 23, 42, 210),
            outline=(30, 41, 59, 220),
            width=1 * scale
        )
        # Left accent stripe
        draw.rounded_rectangle(
            [c_x + 2 * scale, card_y + 12 * scale, c_x + 5 * scale, card_y + card_h - 12 * scale],
            radius=2 * scale,
            fill=c["accent"]
        )
        # Title
        draw.text((c_x + 16 * scale, card_y + 14 * scale), c["title"], font=font_tag, fill=(241, 245, 249, 255))
        # Sub
        draw.text((c_x + 16 * scale, card_y + 40 * scale), c["sub"], font=font_small, fill=(148, 163, 184, 255))
        c_x += card_w + 16 * scale

    # Downscale from 2x supersampling to exact 1584 x 396 with Lanczos filter
    final_banner = base.resize((1584, 396), Image.Resampling.LANCZOS)

    # Save to Downloads and workspace
    out_path_dl = "C:/Users/Rajashekhar/Downloads/rajashekhar_linkedin_banner.png"
    out_path_ws = "C:/Projects/premium-portfolio/public/rajashekhar_linkedin_banner.png"

    final_banner.save(out_path_dl, format="PNG", optimize=True)
    final_banner.save(out_path_ws, format="PNG", optimize=True)
    print(f"Generated LinkedIn Banner successfully at:\n- {out_path_dl}\n- {out_path_ws}")

if __name__ == "__main__":
    create_banner()
