from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_monochrome_luxury():
    # 2x supersampling: 3168 x 792 -> downscale to 1584 x 396
    scale = 2
    w, h = 1584 * scale, 396 * scale

    # 1. Base Canvas: Matte Luxury Graphite (#0c0e12)
    canvas = Image.new("RGBA", (w, h), (12, 14, 18, 255))
    draw = ImageDraw.Draw(canvas)

    # Subtle neutral vignette
    for y in range(h):
        ratio = y / h
        v = int(12 + 6 * (1 - abs(ratio - 0.5) * 2))
        draw.line([(0, y), (w, y)], fill=(v, v + 2, v + 5, 255))

    # 2. Minimalist Architectural Framing:
    # A single, razor-thin, human-designed 1px divider line across the canvas
    line_y = int(68 * scale)
    draw.line([(420 * scale, line_y), (w - 70 * scale, line_y)], fill=(38, 44, 56, 255), width=1 * scale)

    # 3. Fonts
    font_din_heavy = ImageFont.truetype("C:/Windows/Fonts/bahnschrift.ttf", 52 * scale)
    font_din_meta = ImageFont.truetype("C:/Windows/Fonts/bahnschrift.ttf", 15 * scale)
    font_body = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 18 * scale)
    font_badge = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 14 * scale)

    start_x = 425 * scale

    # Helper function for tracking
    def draw_tracked(draw_ctx, pos, text, font, fill_color, spacing=3 * scale):
        cur_x, cur_y = pos
        for ch in text:
            draw_ctx.text((cur_x, cur_y), ch, font=font, fill=fill_color)
            bbox = font.getbbox(ch)
            cur_x += (bbox[2] - bbox[0]) + spacing

    # 4. Eyebrow Tag: Clean, restrained, neutral titanium
    draw_tracked(
        draw,
        (start_x, 92 * scale),
        "FULL-STACK DEVELOPER   ·   AI SYSTEMS",
        font_din_meta,
        (130, 140, 155, 255),
        spacing=4 * scale
    )

    # 5. Name: Crisp, bold, authoritative pure white
    name_y = 132 * scale
    draw.text((start_x, name_y), "RAJASHEKHAR AMARAPPAGOL", font=font_din_heavy, fill=(255, 255, 255, 255))

    # 6. Understated Editorial Subline (No buzzwords, purely professional)
    sub_y = 205 * scale
    draw.text(
        (start_x, sub_y),
        text="Building scalable web applications, real-time architectures & intelligent systems.",
        font=font_body,
        fill=(160, 170, 185, 255)
    )

    # 7. Clean Monochromatic Credentials Bar (Human, minimalist, no rainbow pills)
    bar_y = 265 * scale
    draw.line([(start_x, bar_y), (w - 70 * scale, bar_y)], fill=(32, 38, 48, 255), width=1 * scale)

    # Metadata items: neutral, elegant, separated by middots
    items = [
        "Microsoft Certified: Azure AI",
        "2nd Place @ IEEE GAMEATHON",
        "kadmultiplier.in (Production)",
        "rajashekhar.pages.dev"
    ]

    meta_y = 285 * scale
    cur_x = start_x

    for idx, item in enumerate(items):
        if idx > 0:
            # Neutral bullet
            draw.text((cur_x, meta_y), text="·", font=font_badge, fill=(90, 100, 115, 255))
            b_box = font_badge.getbbox("·")
            cur_x += (b_box[2] - b_box[0]) + 24 * scale

        # Subtle white/silver text
        draw.text((cur_x, meta_y), text=item, font=font_badge, fill=(215, 222, 232, 255))
        i_box = font_badge.getbbox(item)
        cur_x += (i_box[2] - i_box[0]) + 24 * scale

    # Downscale 2x with Lanczos for pure Retina clarity
    final = canvas.resize((1584, 396), Image.Resampling.LANCZOS)
    out_path = "C:/Users/Rajashekhar/Downloads/rajashekhar_linkedin_banner_monochrome.png"
    final.save(out_path, format="PNG", optimize=True)
    final.save("C:/Projects/premium-portfolio/public/rajashekhar_linkedin_banner_monochrome.png", format="PNG", optimize=True)
    print("Generated Monochrome Luxury banner!")


def create_classic_cobalt():
    # 2x supersampling: 3168 x 792 -> downscale to 1584 x 396
    scale = 2
    w, h = 1584 * scale, 396 * scale

    # 1. Base Canvas: Deep Matte Obsidian Navy (#070a10)
    canvas = Image.new("RGBA", (w, h), (8, 11, 17, 255))
    draw = ImageDraw.Draw(canvas)

    # 2. Subtle, human Cobalt Accent (Single vertical bar & subtle rule)
    start_x = 425 * scale

    # Microsoft/Enterprise authentic cobalt blue (#0078d4)
    cobalt = (0, 120, 212, 255)

    # Architectural vertical accent bar on the left of content
    draw.line([(start_x - 22 * scale, 95 * scale), (start_x - 22 * scale, 235 * scale)], fill=cobalt, width=3 * scale)

    # 3. Fonts
    font_din_heavy = ImageFont.truetype("C:/Windows/Fonts/bahnschrift.ttf", 52 * scale)
    font_din_meta = ImageFont.truetype("C:/Windows/Fonts/bahnschrift.ttf", 15 * scale)
    font_body = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 18 * scale)
    font_badge = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 14 * scale)

    # Helper function for tracking
    def draw_tracked(draw_ctx, pos, text, font, fill_color, spacing=3 * scale):
        cur_x, cur_y = pos
        for ch in text:
            draw_ctx.text((cur_x, cur_y), ch, font=font, fill=fill_color)
            bbox = font.getbbox(ch)
            cur_x += (bbox[2] - bbox[0]) + spacing

    # 4. Eyebrow Tag
    draw_tracked(
        draw,
        (start_x, 92 * scale),
        "FULL-STACK DEVELOPER   /   MICROSOFT CERTIFIED AZURE AI",
        font_din_meta,
        cobalt,
        spacing=4 * scale
    )

    # 5. Name
    name_y = 132 * scale
    draw.text((start_x, name_y), text="RAJASHEKHAR AMARAPPAGOL", font=font_din_heavy, fill=(255, 255, 255, 255))

    # 6. Subline
    sub_y = 205 * scale
    draw.text(
        (start_x, sub_y),
        text="React  ·  TypeScript  ·  Firebase  ·  MongoDB  ·  Three.js",
        font=font_body,
        fill=(156, 163, 175, 255)
    )

    # 7. Bottom Metadata Pills: Dark slate with clean 1px border
    pills = [
        "Certified Azure AI Developer",
        "2nd Place @ IEEE GAMEATHON",
        "Live @ kadmultiplier.in",
        "rajashekhar.pages.dev"
    ]

    pill_y = 265 * scale
    cur_x = start_x

    for p in pills:
        bbox = font_badge.getbbox(p)
        pw = (bbox[2] - bbox[0]) + 28 * scale
        ph = 36 * scale

        # Neutral dark slate container
        draw.rounded_rectangle(
            [cur_x, pill_y, cur_x + pw, pill_y + ph],
            radius=6 * scale,
            fill=(15, 20, 28, 240),
            outline=(35, 45, 60, 255),
            width=1 * scale
        )
        draw.text((cur_x + 14 * scale, pill_y + 8 * scale), text=p, font=font_badge, fill=(225, 231, 239, 255))
        cur_x += pw + 16 * scale

    # Downscale
    final = canvas.resize((1584, 396), Image.Resampling.LANCZOS)
    out_path = "C:/Users/Rajashekhar/Downloads/rajashekhar_linkedin_banner_cobalt.png"
    final.save(out_path, format="PNG", optimize=True)
    final.save("C:/Projects/premium-portfolio/public/rajashekhar_linkedin_banner_cobalt.png", format="PNG", optimize=True)
    print("Generated Classic Cobalt banner!")

if __name__ == "__main__":
    create_monochrome_luxury()
    create_classic_cobalt()
