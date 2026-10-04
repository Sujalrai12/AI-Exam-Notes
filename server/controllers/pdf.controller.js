import PDFDocument from "pdfkit";

const countStars = (value) =>
    Array.from(String(value ?? "")).filter((character) => character === "⭐").length;

const drawStar = (doc, centerX, centerY, outerRadius = 5.5) => {
    const innerRadius = outerRadius * 0.45;

    for (let point = 0; point < 10; point += 1) {
        const angle = -Math.PI / 2 + (point * Math.PI) / 5;
        const radius = point % 2 === 0 ? outerRadius : innerRadius;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (point === 0) {
            doc.moveTo(x, y);
        } else {
            doc.lineTo(x, y);
        }
    }

    doc.closePath().fill();
};

const drawStarLine = (doc, { prefix = "", stars = 0, suffix = "", fontSize = 14 }) => {
    const left = doc.page.margins.left;
    const top = doc.y;
    const spacing = 14;
    const starCount = Math.max(0, stars);

    doc.fontSize(fontSize);

    if (prefix) {
        doc.text(prefix, left, top, { lineBreak: false });
    }

    const starStart = prefix ? left + doc.widthOfString(prefix) + 6 : left;
    for (let index = 0; index < starCount; index += 1) {
        drawStar(doc, starStart + index * spacing + 5.5, top + fontSize * 0.6);
    }

    if (suffix) {
        doc.text(suffix, starStart + starCount * spacing + 2, top, { lineBreak: false });
    }

    doc.x = left;
    doc.y = top + doc.currentLineHeight(true) + 2;
};

export const pdfDownload = async (req, res) => {
    const { result } = req.body ?? {};

    if (!result) {
        return res.status(400).json({ error: "No content provided" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        'attachment; filename="ExamNotesAI.pdf"'
    );

    doc.pipe(res);

    doc.fontSize(20).text("ExamNotes AI", { align: "center" });
    doc.moveDown();
    drawStarLine(doc, {
        prefix: "Importance:",
        stars: countStars(result.importance),
        fontSize: 14,
    });
    doc.moveDown();

    doc.fontSize(16).text("Sub Topics");
    doc.moveDown(0.5);

    for (const [star, topics] of Object.entries(result.subTopics ?? {})) {
        doc.moveDown(0.5);
        drawStarLine(doc, {
            stars: countStars(star),
            suffix: "Topics:",
            fontSize: 13,
        });

        for (const topic of topics ?? []) {
            doc.fontSize(12).text(`- ${topic}`);
        }
    }

    doc.moveDown();
    doc.fontSize(16).text("Notes");
    doc.moveDown(0.5);
    doc.fontSize(12).text(
        String(result.notes ?? "").replace(/[#*]/g, "")
    );

    doc.moveDown();
    doc.fontSize(16).text("Revision Points");
    doc.moveDown(0.5);

    for (const point of result.revisionPoints ?? []) {
        doc.fontSize(12).text(`- ${point}`);
    }

    doc.moveDown();
    doc.fontSize(16).text("Important Questions");
    doc.moveDown(0.5);

    const questions = result.questions ?? {};

    doc.fontSize(13).text("Short Questions:");
    for (const question of questions.short ?? []) {
        doc.fontSize(12).text(`- ${question}`);
    }

    doc.moveDown(0.5);
    doc.fontSize(13).text("Long Questions:");
    for (const question of questions.long ?? []) {
        doc.fontSize(12).text(`- ${question}`);
    }

    doc.moveDown(0.5);
    doc.fontSize(13).text("Diagram Question:");
    doc.fontSize(12).text(String(questions.diagram ?? ""));

    doc.end();
};