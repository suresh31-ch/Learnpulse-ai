import { jsPDF } from 'jspdf';
import { StudentProgressReportData } from '../types';

/**
 * Generates and downloads a high-fidelity, professional LearnPulse AI Progress Report as a PDF
 * using genuine vector text and clean tabular layout.
 */
export function generateStudentProgressReportPDF(data: StudentProgressReportData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  let y = margin;

  // Colors
  const primaryNavy = [15, 23, 42]; // #0f172a
  const accentIndigo = [79, 70, 229]; // #4f46e5
  const textDark = [30, 41, 59]; // #1e293b
  const textMuted = [100, 116, 139]; // #64748b
  const emeraldGreen = [16, 185, 129];
  const roseRed = [244, 63, 94];

  // Helper for text formatting
  const addHeader = (text: string, size = 13, bold = true) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.text(text, margin, y);
    y += size * 0.45 + 3;
  };

  // 1. Top Brand Banner
  doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('LearnPulse AI — Student Progress & Diagnostic Report', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(199, 210, 254);
  doc.text('Deterministic Learning Intelligence', pageWidth - margin - 56, 14);

  y = 34;

  // 2. Student Metadata Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 24, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text(data.studentName, margin + 5, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Institution: ${data.institutionName}  |  Class: ${data.className}  |  Roll No: ${data.rollNumber}`, margin + 5, y + 14);
  doc.text(`Generated: ${data.generatedDate}  |  Curriculum: CBSE / Cambridge Alignment`, margin + 5, y + 19);

  y += 32;

  // 3. Key Summary Metrics Grid (4 columns)
  const colWidth = (pageWidth - 2 * margin - 9) / 4;
  const metrics = [
    { label: 'Overall Mastery', value: `${data.overallMastery}%`, sub: `${data.trendDirection === 'up' ? '+' : ''}${data.trendDelta}% Trend` },
    { label: 'Recent Accuracy', value: `${data.recentAccuracy}%`, sub: 'Formative checks' },
    { label: 'Practice Time', value: `${data.practiceHours} hrs`, sub: 'This cycle' },
    { label: 'Daily Streak', value: `${data.streakDays} Days`, sub: 'Consistent learner' },
  ];

  metrics.forEach((m, idx) => {
    const x = margin + idx * (colWidth + 3);
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(x, y, colWidth, 18, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
    doc.text(m.value, x + 4, y + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(m.label, x + 4, y + 12.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(m.sub, x + 4, y + 16);
  });

  y += 26;

  // 4. Learning Recovery Score Spotlight
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
  doc.text('Product Metric: LearnPulse Learning Recovery Score', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(
    `Baseline: ${data.learningRecoveryScore.baseline}%   ->   Current: ${data.learningRecoveryScore.current}%   ->   Recovery Gain: +${data.learningRecoveryScore.gain} percentage points`,
    margin + 5,
    y + 12
  );
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Status: ${data.learningRecoveryScore.status} | Calculated from targeted concept repair interventions`, margin + 5, y + 16.5);

  y += 27;

  // 5. Detected Learning Gaps (Table)
  addHeader('Identified Learning Gaps & Action Plan', 11);

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, pageWidth - 2 * margin, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('Topic & Concept', margin + 3, y + 4.5);
  doc.text('Current Mastery', margin + 58, y + 4.5);
  doc.text('Severity', margin + 85, y + 4.5);
  doc.text('Targeted Action Plan', margin + 105, y + 4.5);

  y += 7.5;

  data.learningGaps.slice(0, 3).forEach((gap) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(gap.topic, margin + 3, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(gap.concept, margin + 3, y + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(gap.currentMastery < 50 ? roseRed[0] : primaryNavy[0], gap.currentMastery < 50 ? roseRed[1] : primaryNavy[1], gap.currentMastery < 50 ? roseRed[2] : primaryNavy[2]);
    doc.text(`${gap.currentMastery}%`, margin + 62, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(gap.severity.toUpperCase(), margin + 85, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(doc.splitTextToSize(gap.recommendedAction, 65), margin + 105, y + 4);

    y += 12;
  });

  y += 3;

  // 6. Strongest Mastered Areas
  addHeader('Areas of Solid Conceptual Mastery', 11);
  data.strongestAreas.slice(0, 3).forEach((sa) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
    doc.text(`[MASTERED ${sa.score}%]`, margin + 2, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(`${sa.topic} (${sa.subject})`, margin + 36, y + 4);
    y += 6.5;
  });

  y += 4;

  // 7. Next Best Learning Action
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(22, 101, 52);
  doc.text('Next Best Learning Action:', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(21, 128, 61);
  doc.text(doc.splitTextToSize(data.nextBestAction, pageWidth - 2 * margin - 10), margin + 4, y + 12);

  // Footer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Confidential Educational Progress Record — Generated automatically by LearnPulse AI.', margin, pageHeight - 10);
  doc.text(`Page 1 of 1`, pageWidth - margin - 15, pageHeight - 10);

  // Trigger browser download
  const safeFilename = `LearnPulse_Report_${data.studentName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(safeFilename);
}
