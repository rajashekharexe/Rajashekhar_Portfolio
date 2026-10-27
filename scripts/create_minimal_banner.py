from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_minimal_banner():
    scale = 2
    w, h = 1584 * scale, 396 * scale

    # 1. Obsidian Void Canvas
    canvas = Image.new("RGBA", (w, h), (4, 6, 12, 255))
    draw = ImageDraw.Draw(canvas)

    # 2. Sleek Horizon Accent (Thin glowing gradient line in the upper third)
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)

    # Subtle ambient flare behind text
    g_draw.ellipse([w - 850 * scale, -150 * scale, w + 100 * scale, 350 * scale], fill=(56, 189, 248, 45))
    g_draw.ellipse([w - 1150 * scale, -200 * scale, w - 200 * scale, 400 * scale], fill=(99, 102, 241, 35))
    glow = glow.filter(ImageFilter.GaussianBlur(80 * scale))
    canvas = Image.alpha_composite(canvas, glow)
    draw = ImageDraw.Draw(canvas)

    # 3. Fonts
    font_mono = ImageFont.truetype("C:/Windows/Fonts/consolab.ttf", 15 * scale)
    font_title = ImageFont.truetype("C:/Windows/Fonts/bahnschrift.ttf", 58 * scale)
    font_sub = ImageFont.truetype("C:/Windows/Fonts/bahnschrift.ttf", 20 * scale)
    font_pill = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 15 * scale)

    start_x = 425 * scale

    # Helper function for tracked text
    def draw_tracked(draw_ctx, pos, text, font, fill, spacing=3 * scale):
        cur_x, cur_y = pos
        for ch in text:
            draw_ctx.text((cur_x, cur_y), ch, font=font, fill=fill)
            bbox = font.getbbox(ch)
            cur_x += (bbox[2] - bbox[0]) + spacing

    # 4. Eyebrow Tagline
    draw_tracked(
        draw,
        (start_x, 80 * scale),
        "FULL-STACK SOFTWARE ENGINEER   ·   AI SYSTEMS",
        font_sub,
        (56, 189, 248, 255),
        spacing=4 * scale
    )

    # 5. Name
    draw.text((start_x, 120 * scale), "RAJASHEKHAR AMARAPPAGOL", font=font_title, fill=(255, 255, 255, 255))

    # 6. Minimalist Proof Points in an elegant inline row
    # Terminal badge / pill
    pill_y = 215 * scale
    pill_items = [
        ("✦  Microsoft Certified: Azure AI", (56, 189, 248, 255)),
        ("🏆  2nd Place IEEE GAMEATHON", (245, 158, 11, 255)),
        ("⚡  Live @ kadmultiplier.in", (16, 185, 129, 255)),
        ("🌐  rajashekhar.pages.dev", (203, 213, 225, 255))
    ]

    cur_pill_x = start_x
    for label, col in pill_items:
        bbox = font_pill.getbbox(label)
        pw = (bbox[2] - bbox[0]) + 30 * scale
        ph = 36 * scale

        # Glass pill container
        draw.rounded_rectangle(
            [cur_pill_x, pill_y, cur_pill_x + pw, pill_y + ph],
            radius=18 * scale,
            fill=(15, 23, 42, 200),
            outline=(51, 65, 85, 180),
            width=1 * scale
        )
        draw.text((cur_pill_x + 15 * scale, pill_y + 8 * scale), label, font=font_pill, fill=col)
        cur_pill_x += pw + 16 * scale

    # Downscale from 2x
    final = canvas.resize((1584, 396), Image.Resampling.LANCZOS)

    out_dl = "C:/Users/Rajashekhar/Downloads/rajashekhar_linkedin_banner_minimal.png"
    out_ws = "C:/Projects/premium-portfolio/public/rajashekhar_linkedin_banner_minimal.png"
    final.save(out_dl, format="PNG", optimize=True)
    final.save(out_ws, format="PNG", optimize=True)
    print("Minimal banner generated successfully!")

if __name__ == "__main__":
    create_minimal_banner()
