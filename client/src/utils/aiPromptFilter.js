export const parsePromptToFilter = (prompt) => {
  const filters = {
    pickup: "",
    dropoff: "",
    time: "",
    date: "",
  };

  const lowercasePrompt = prompt.toLowerCase();

  // Extract locations using common patterns
  const fromMatch = lowercasePrompt.match(
    /from\s+([^to]+?)(?:\s+to|\s+at|\s*$)/i
  );
  const toMatch = lowercasePrompt.match(/to\s+([^at]+?)(?:\s+at|\s*$)/i);

  if (fromMatch) {
    filters.pickup = fromMatch[1].trim();
  }

  if (toMatch) {
    filters.dropoff = toMatch[1].trim();
  }

  // Extract time patterns
  const timePatterns = [
    /(\d{1,2}):(\d{2})\s*(am|pm)/i,
    /(\d{1,2})\s*(am|pm)/i,
    /(\d{1,2}):(\d{2})/,
    /(morning|afternoon|evening|night)/i,
  ];

  for (const pattern of timePatterns) {
    const match = lowercasePrompt.match(pattern);
    if (match) {
      if (match[3]) {
        // Has AM/PM
        filters.time = `${match[1]}:${
          match[2] || "00"
        } ${match[3].toUpperCase()}`;
      } else if (match[2] && !match[3]) {
        // Has AM/PM without minutes
        filters.time = `${match[1]}:00 ${match[2].toUpperCase()}`;
      } else if (match[1] && match[2] && !match[3]) {
        // 24-hour format
        filters.time = `${match[1]}:${match[2]}`;
      } else if (match[1]) {
        // General time like "morning"
        const timeMap = {
          morning: "09:00",
          afternoon: "14:00",
          evening: "18:00",
          night: "21:00",
        };
        filters.time = timeMap[match[1]];
      }
      break;
    }
  }

  // Extract date patterns
  const datePatterns = [
    /today/i,
    /tomorrow/i,
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
    /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
  ];

  for (const pattern of datePatterns) {
    const match = lowercasePrompt.match(pattern);
    if (match) {
      if (match[0].toLowerCase() === "today") {
        filters.date = targetDate.toISOString().split("T")[0];
      }
      break;
    }
  }

  return filters;
};
