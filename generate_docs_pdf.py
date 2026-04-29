from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

SOURCE_FILES = [
    ('GurukulEduWebApp_Detailed_Overview.md', 'GurukulEduWebApp_Project_Overview.pdf'),
    ('GurukulEduWebApp_Database_Schema.md', 'GurukulEduWebApp_Database_Schema.pdf')
]

FONT_PATH = r'C:\Windows\Fonts\Nirmala.ttf'
FONT_NAME = 'Nirmala'

try:
    pdfmetrics.registerFont(TTFont(FONT_NAME, FONT_PATH))
except Exception as e:
    raise RuntimeError(f'Failed to load font {FONT_PATH}: {e}')

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='MyHeading1', fontName=FONT_NAME, fontSize=18, leading=22, spaceAfter=12))
styles.add(ParagraphStyle(name='MyHeading2', fontName=FONT_NAME, fontSize=14, leading=18, spaceAfter=10))
styles.add(ParagraphStyle(name='MyHeading3', fontName=FONT_NAME, fontSize=12, leading=16, spaceAfter=8))
styles.add(ParagraphStyle(name='MyBodyText', fontName=FONT_NAME, fontSize=10, leading=14, spaceAfter=6))
styles.add(ParagraphStyle(name='MyBullet', fontName=FONT_NAME, fontSize=10, leading=14, leftIndent=12, bulletIndent=6, spaceAfter=4, bulletFontName=FONT_NAME))

for src, out in SOURCE_FILES:
    path = Path(src)
    if not path.exists():
        raise FileNotFoundError(f'Missing source file: {src}')

    doc = SimpleDocTemplate(out, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    content = path.read_text(encoding='utf-8').splitlines()
    story = []

    for line in content:
        stripped = line.strip()
        if not stripped:
            story.append(Spacer(1, 6))
            continue
        if stripped.startswith('# '):
            story.append(Paragraph(stripped[2:].strip(), styles['MyHeading1']))
        elif stripped.startswith('## '):
            story.append(Paragraph(stripped[3:].strip(), styles['MyHeading2']))
        elif stripped.startswith('### '):
            story.append(Paragraph(stripped[4:].strip(), styles['MyHeading3']))
        elif stripped.startswith('- '):
            story.append(Paragraph(stripped[2:].strip(), styles['MyBullet'], bulletText='•'))
        elif stripped.startswith('```'):
            continue
        else:
            story.append(Paragraph(stripped, styles['MyBodyText']))

    doc.build(story)
    print(f'Created {out}')
