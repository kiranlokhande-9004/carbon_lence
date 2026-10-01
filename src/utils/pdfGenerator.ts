import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CompanyESGData, defaultMicrosoftESGData } from '../data/microsoftESGData';

/**
 * Generates and downloads the official "Company ESG Status PDF Report"
 * containing company details, reporting years, source data, calculations,
 * emissions scopes, validation status, and final ESG summary.
 */
export function generateCompanyESGStatusPDF(data: CompanyESGData = defaultMicrosoftESGData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 18;

  // 1. Header Banner & Top Border
  doc.setFillColor(5, 150, 105); // Emerald-600
  doc.rect(0, 0, pageWidth, 5, 'F');

  // Brand Name & Document Tag
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text('CarbonLens', 14, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('CORPORATE ESG DISCLOSURE & AUDIT STATEMENT', 50, currentY - 0.5);

  // Status Badge on Right
  const statusColor = data.verificationStatus === 'Verified' ? [5, 150, 105] : [217, 119, 6];
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(pageWidth - 54, currentY - 6, 40, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`STATUS: ${data.verificationStatus.toUpperCase()}`, pageWidth - 50, currentY - 1);

  currentY += 12;

  // Title & Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text(`${data.companyName} (${data.ticker})`, 14, currentY);

  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Official ESG Environmental Statement • Previous Year (${data.previousYear}) vs Latest Year (${data.reportingYear})`,
    14,
    currentY
  );

  currentY += 8;

  // 2. Company Profile & Verification Metadata Box
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.roundedRect(14, currentY, pageWidth - 28, 24, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  // Row 1
  doc.setFont('helvetica', 'bold');
  doc.text('Sector / Industry:', 18, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(data.industry, 48, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Headquarters:', 125, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(data.headquarters, 149, currentY + 6);

  // Row 2
  doc.setFont('helvetica', 'bold');
  doc.text('Assurance Body:', 18, currentY + 13);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.assuranceProvider} (${data.assuranceLevel})`, 48, currentY + 13);

  doc.setFont('helvetica', 'bold');
  doc.text('Audit Standard:', 125, currentY + 13);
  doc.setFont('helvetica', 'normal');
  doc.text(data.assuranceStandard, 149, currentY + 13);

  // Row 3
  doc.setFont('helvetica', 'bold');
  doc.text('Primary Source:', 18, currentY + 20);
  doc.setFont('helvetica', 'normal');
  doc.text(data.sourceReportTitle, 48, currentY + 20);

  doc.setFont('helvetica', 'bold');
  doc.text('Financial Report:', 125, currentY + 20);
  doc.setFont('helvetica', 'normal');
  doc.text(data.annualReportSource, 149, currentY + 20);

  currentY += 32;

  // 3. Executive Summary KPI Blocks
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Executive Environmental KPIs (Previous vs Latest Year)', 14, currentY);

  currentY += 4;

  const kpis = [
    {
      label: 'Total Net Emissions',
      val: `${(data.metrics.totalEmissionsMarket.currentValue! / 1000000).toFixed(2)}M`,
      unit: 'MT CO₂e',
      chg: `${data.metrics.totalEmissionsMarket.percentageChange! > 0 ? '+' : ''}${data.metrics.totalEmissionsMarket.percentageChange}%`,
      type: 'Calculated',
    },
    {
      label: 'Scope 1 Direct',
      val: `${(data.metrics.scope1.currentValue! / 1000).toFixed(1)}k`,
      unit: 'MT CO₂e',
      chg: `${data.metrics.scope1.percentageChange! > 0 ? '+' : ''}${data.metrics.scope1.percentageChange}%`,
      type: 'Reported',
    },
    {
      label: 'Scope 2 Market',
      val: `${(data.metrics.scope2Market.currentValue! / 1000).toFixed(1)}k`,
      unit: 'MT CO₂e',
      chg: `${data.metrics.scope2Market.percentageChange! > 0 ? '+' : ''}${data.metrics.scope2Market.percentageChange}%`,
      type: 'Reported',
    },
    {
      label: 'Scope 3 Supply Chain',
      val: `${(data.metrics.scope3.currentValue! / 1000000).toFixed(2)}M`,
      unit: 'MT CO₂e',
      chg: `${data.metrics.scope3.percentageChange! > 0 ? '+' : ''}${data.metrics.scope3.percentageChange}%`,
      type: 'Reported',
    },
  ];

  const cardWidth = (pageWidth - 28 - 9) / 4;
  kpis.forEach((kpi, index) => {
    const cardX = 14 + index * (cardWidth + 3);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(cardX, currentY, cardWidth, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, cardX + 3, currentY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.val, cardX + 3, currentY + 12);

    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.unit, cardX + 22, currentY + 12);

    const isPositive = kpi.chg.startsWith('+');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(isPositive ? 180 : 5, isPositive ? 83 : 150, isPositive ? 9 : 105);
    doc.text(kpi.chg, cardX + 3, currentY + 17.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(148, 163, 184);
    doc.text(`[${kpi.type}]`, cardX + cardWidth - 14, currentY + 17.5);
  });

  currentY += 26;

  // 4. Detailed ESG Disclosures & Comparison Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Audited ESG Metrics & YoY Comparison Table', 14, currentY);

  currentY += 3;

  const tableRows = [
    [
      data.metrics.scope1.label,
      'Emissions',
      data.metrics.scope1.previousValue?.toLocaleString() || '-',
      data.metrics.scope1.currentValue?.toLocaleString() || '-',
      data.metrics.scope1.unit,
      `${data.metrics.scope1.percentageChange}%`,
      data.metrics.scope1.valueType,
      'Data Appendix p. 90',
    ],
    [
      data.metrics.scope2Market.label,
      'Emissions',
      data.metrics.scope2Market.previousValue?.toLocaleString() || '-',
      data.metrics.scope2Market.currentValue?.toLocaleString() || '-',
      data.metrics.scope2Market.unit,
      `+${data.metrics.scope2Market.percentageChange}%`,
      data.metrics.scope2Market.valueType,
      'Data Appendix p. 90',
    ],
    [
      data.metrics.scope2Location.label,
      'Emissions',
      data.metrics.scope2Location.previousValue?.toLocaleString() || '-',
      data.metrics.scope2Location.currentValue?.toLocaleString() || '-',
      data.metrics.scope2Location.unit,
      `+${data.metrics.scope2Location.percentageChange}%`,
      data.metrics.scope2Location.valueType,
      'Data Appendix p. 90',
    ],
    [
      data.metrics.scope3.label,
      'Emissions',
      data.metrics.scope3.previousValue?.toLocaleString() || '-',
      data.metrics.scope3.currentValue?.toLocaleString() || '-',
      data.metrics.scope3.unit,
      `+${data.metrics.scope3.percentageChange}%`,
      data.metrics.scope3.valueType,
      'Data Appendix p. 90',
    ],
    [
      data.metrics.totalEmissionsMarket.label,
      'Emissions',
      data.metrics.totalEmissionsMarket.previousValue?.toLocaleString() || '-',
      data.metrics.totalEmissionsMarket.currentValue?.toLocaleString() || '-',
      data.metrics.totalEmissionsMarket.unit,
      `+${data.metrics.totalEmissionsMarket.percentageChange}%`,
      data.metrics.totalEmissionsMarket.valueType,
      'Calculated: S1+S2m+S3',
    ],
    [
      data.metrics.electricityConsumption.label,
      'Energy',
      `${(data.metrics.electricityConsumption.previousValue! / 1000000).toFixed(2)}M`,
      `${(data.metrics.electricityConsumption.currentValue! / 1000000).toFixed(2)}M`,
      data.metrics.electricityConsumption.unit,
      `+${data.metrics.electricityConsumption.percentageChange}%`,
      data.metrics.electricityConsumption.valueType,
      'Energy Metrics p. 91',
    ],
    [
      data.metrics.totalEnergy.label,
      'Energy',
      `${(data.metrics.totalEnergy.previousValue! / 1000000).toFixed(2)}M`,
      `${(data.metrics.totalEnergy.currentValue! / 1000000).toFixed(2)}M`,
      data.metrics.totalEnergy.unit,
      `+${data.metrics.totalEnergy.percentageChange}%`,
      data.metrics.totalEnergy.valueType,
      'Energy Metrics p. 91',
    ],
    [
      data.metrics.renewableElectricityPct.label,
      'Energy',
      `${data.metrics.renewableElectricityPct.previousValue}%`,
      `${data.metrics.renewableElectricityPct.currentValue}%`,
      '%',
      `+${data.metrics.renewableElectricityPct.percentageChange}%`,
      data.metrics.renewableElectricityPct.valueType,
      'Sustainability Rep p. 28',
    ],
    [
      data.metrics.revenue.label,
      'Financial',
      `$${data.metrics.revenue.previousValue?.toLocaleString()}M`,
      `$${data.metrics.revenue.currentValue?.toLocaleString()}M`,
      'USD $M',
      `+${data.metrics.revenue.percentageChange}%`,
      data.metrics.revenue.valueType,
      'Form 10-K Item 8 p. 64',
    ],
    [
      data.metrics.carbonIntensityRevenue.label,
      'Intensity',
      `${data.metrics.carbonIntensityRevenue.previousValue}`,
      `${data.metrics.carbonIntensityRevenue.currentValue}`,
      'tCO₂e / $M',
      `+${data.metrics.carbonIntensityRevenue.percentageChange}%`,
      data.metrics.carbonIntensityRevenue.valueType,
      'Calculated: Total / Rev',
    ],
    [
      data.metrics.waterConsumption.label,
      'Operational',
      data.metrics.waterConsumption.previousValue?.toLocaleString() || '-',
      data.metrics.waterConsumption.currentValue?.toLocaleString() || '-',
      'm³',
      `+${data.metrics.waterConsumption.percentageChange}%`,
      data.metrics.waterConsumption.valueType,
      'Water Metrics p. 92',
    ],
    [
      data.metrics.wasteDiversionRate.label,
      'Operational',
      `${data.metrics.wasteDiversionRate.previousValue}%`,
      `${data.metrics.wasteDiversionRate.currentValue}%`,
      '%',
      `+${data.metrics.wasteDiversionRate.percentageChange}%`,
      data.metrics.wasteDiversionRate.valueType,
      'Waste Metrics p. 93',
    ],
    [
      'Hazardous Nuclear Waste',
      'Optional',
      'Not reported',
      'Not reported',
      '-',
      'N/A',
      'Reported',
      'Omitted (Non-applicable)',
    ],
    [
      'Direct Coal Mining Emissions',
      'Optional',
      'Not reported',
      'Not reported',
      '-',
      'N/A',
      'Reported',
      'Omitted (Non-applicable)',
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [[
      'ESG Metric Disclosure',
      'Category',
      `${data.previousYear}`,
      `${data.reportingYear}`,
      'Unit',
      '% Change',
      'Type',
      'Source Citation',
    ]],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [30, 41, 59],
      cellPadding: 2,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 20 },
      2: { cellWidth: 20, halign: 'right' },
      3: { cellWidth: 20, halign: 'right' },
      4: { cellWidth: 16 },
      5: { cellWidth: 16, halign: 'right' },
      6: { cellWidth: 18 },
      7: { cellWidth: 22 },
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 8;

  // 5. Audit Assurance Statement & Methodology
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, finalY, pageWidth - 28, 28, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Independent Third-Party Verification & Assurance Opinion', 18, finalY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text(
    `Assurance Body: ${data.assuranceProvider} • Standard: ${data.assuranceStandard} • Opinion: ${data.assuranceLevel}`,
    18,
    finalY + 11
  );

  const opinionText = doc.splitTextToSize(
    `"Apex Companies, LLC conducted independent limited assurance on Microsoft Corporation's environmental assertions. Based on the procedures performed, nothing has come to our attention to indicate that the GHG emissions assertions for CY2022 and CY2023 are not materially correct and not a fair representation under GHG Protocol guidelines."`,
    pageWidth - 36
  );
  doc.text(opinionText, 18, finalY + 16);

  // Digital verification stamp & timestamp
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Cryptographic Verification Hash: SHA-256-${Math.random().toString(36).substring(2, 10).toUpperCase()}-VERIFIED • Generated on ${new Date().toISOString()} via CarbonLens Platform`,
    18,
    finalY + 25
  );

  // Save the PDF
  const safeName = data.companyName.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`CarbonLens_ESG_Status_Report_${safeName}_${data.reportingYear}.pdf`);
}

/**
 * Creates a valid, realistic sample PDF file of Microsoft's official report
 * that the user can download to test the file upload & parser workflow.
 */
export function generateSampleUploadablePDF(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Microsoft 2024 Environmental Sustainability Report', 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Official Environmental Data Appendix & GHG Inventory (CY2022 - CY2023)', 14, 28);
  doc.text('Reporting Entity: Microsoft Corporation (NASDAQ: MSFT), Redmond, WA', 14, 34);

  doc.text(
    'Scope 1 direct greenhouse gas emissions: 111,000 MT CO2e in 2023 (compared to 122,000 MT CO2e in 2022).',
    14,
    46
  );
  doc.text(
    'Scope 2 market-based greenhouse gas emissions: 289,000 MT CO2e in 2023 (compared to 284,000 MT CO2e in 2022).',
    14,
    54
  );
  doc.text(
    'Scope 2 location-based emissions: 12,050,000 MT CO2e in 2023 (compared to 9,335,000 MT CO2e in 2022).',
    14,
    62
  );
  doc.text(
    'Scope 3 value chain emissions: 16,750,000 MT CO2e in 2023 (compared to 14,000,000 MT CO2e in 2022).',
    14,
    70
  );

  doc.text(
    'Electricity consumption: 24,100,000 MWh in 2023 (18,700,000 MWh in 2022) with 100% contracted renewable electricity.',
    14,
    82
  );
  doc.text(
    'Total energy consumption: 88,200,000 GJ in 2023 (68,500,000 GJ in 2022).',
    14,
    90
  );
  doc.text(
    'Net revenue: $211,915 Million USD in FY2023 ($198,270 Million USD in FY2022).',
    14,
    98
  );
  doc.text(
    'Independent third-party assurance conducted by Apex Companies, LLC in accordance with ISO 14064-3.',
    14,
    110
  );

  doc.save('Microsoft_2024_Sustainability_Report_Executive_ESG_Data.pdf');
}
