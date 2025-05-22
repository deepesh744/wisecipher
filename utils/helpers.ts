// Extract dates/obligations/risks from summary for MVP dashboard

export function extractDashboardItems(summary: string) {
    // Simple regex extraction for dates, obligations, risks
    const dateRegex = /\b(\d{1,2} [A-Za-z]+ \d{4}|\d{4}-\d{2}-\d{2})\b/g;
    const dates = summary.match(dateRegex) || [];
  
    const obligations = summary
      .split('\n')
      .filter(line => /must|shall|should|is required|responsible/i.test(line));
  
    const risks = summary
      .split('\n')
      .filter(line => /risk|liable|penalty|loss|consequence/i.test(line));
  
    return { dates, obligations, risks };
  }
  