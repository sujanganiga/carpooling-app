export const parsePromptToFilter = (prompt) => {
  const filters = {
    pickup: "",
    dropoff: "",
    date: "",
    maxPrice: "",
    minSeats: "",
  };

  const lowercasePrompt = prompt.toLowerCase();

  // Extract locations using common patterns
  const locationPatterns = [
    /from\s+([^to]+?)(?:\s+to|\s+at|\s+under|\s+with|\s*$)/i,
    /rides?\s+from\s+([^to]+?)(?:\s+to|\s+at|\s+under|\s+with|\s*$)/i,
    /looking\s+for\s+rides?\s+from\s+([^to]+?)(?:\s+to|\s+at|\s+under|\s+with|\s*$)/i,
    /need\s+a\s+ride\s+from\s+([^to]+?)(?:\s+to|\s+at|\s+under|\s+with|\s*$)/i,
  ];

  const toPatterns = [
    /to\s+([^u]+?)(?:\s+under|\s+with|\s+at|\s*$)/i,
    /rides?\s+to\s+([^u]+?)(?:\s+under|\s+with|\s+at|\s*$)/i,
    /looking\s+for\s+rides?\s+to\s+([^u]+?)(?:\s+under|\s+with|\s+at|\s*$)/i,
    /need\s+a\s+ride\s+to\s+([^u]+?)(?:\s+under|\s+with|\s+at|\s*$)/i,
    /show\s+me\s+rides?\s+to\s+([^u]+?)(?:\s+under|\s+with|\s+at|\s*$)/i,
  ];

  // Try all patterns for pickup location
  for (const pattern of locationPatterns) {
    const match = lowercasePrompt.match(pattern);
    if (match) {
      filters.pickup = match[1].trim();
      break;
    }
  }

  // Try all patterns for dropoff location
  for (const pattern of toPatterns) {
    const match = lowercasePrompt.match(pattern);
    if (match) {
      filters.dropoff = match[1].trim();
      break;
    }
  }

  // Extract price patterns
  const pricePatterns = [
    /under\s+₹?\s*(\d+)/i,
    /less\s+than\s+₹?\s*(\d+)/i,
    /maximum\s+₹?\s*(\d+)/i,
    /max\s+₹?\s*(\d+)/i,
    /upto\s+₹?\s*(\d+)/i,
    /up\s+to\s+₹?\s*(\d+)/i,
    /₹?\s*(\d+)/i, // Match any price with or without ₹ symbol
  ];

  for (const pattern of pricePatterns) {
    const match = lowercasePrompt.match(pattern);
    if (match) {
      filters.maxPrice = match[1];
      break;
    }
  }

  // Extract seats patterns
  const seatsPatterns = [
    /with\s+(\d+)\s+seats?/i,
    /for\s+(\d+)\s+people/i,
    /for\s+(\d+)\s+persons?/i,
    /(\d+)\s+seats?/i,
    /(\d+)\s+people/i,
    /(\d+)\s+persons?/i,
  ];

  for (const pattern of seatsPatterns) {
    const match = lowercasePrompt.match(pattern);
    if (match) {
      filters.minSeats = match[1];
      break;
    }
  }

  // Extract time patterns
  const timePatterns = [
    /(\d{1,2}):(\d{2})\s*(am|pm)/i,
    /(\d{1,2})\s*(am|pm)/i,
    /(\d{1,2}):(\d{2})/,
    /(morning|afternoon|evening|night)/i,
  ];

  // Extract date patterns
  const datePatterns = [
    /today/i,
    /tomorrow/i,
    /this\s+weekend/i,
    /next\s+week/i,
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
    /(\d{1,2})-(\d{1,2})-(\d{4})/,
    /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
  ];

  for (const pattern of datePatterns) {
    const match = lowercasePrompt.match(pattern);
    if (match) {
      const today = new Date();
      if (match[0].toLowerCase() === "today") {
        filters.date = today.toISOString().split("T")[0];
      } else if (match[0].toLowerCase() === "tomorrow") {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        filters.date = tomorrow.toISOString().split("T")[0];
      } else if (match[0].toLowerCase() === "this weekend") {
        const saturday = new Date(today);
        saturday.setDate(saturday.getDate() + (6 - saturday.getDay()));
        filters.date = saturday.toISOString().split("T")[0];
      } else if (match[0].toLowerCase() === "next week") {
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        filters.date = nextWeek.toISOString().split("T")[0];
      } else if (match[1] && match[2] && match[3]) {
        // Handle DD/MM/YYYY or DD-MM-YYYY format
        const year = parseInt(match[3]);
        const month = parseInt(match[2]) - 1;
        const day = parseInt(match[1]);
        const date = new Date(year, month, day);
        filters.date = date.toISOString().split("T")[0];
      } else {
        // Handle day names
        const dayMap = {
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6,
          sunday: 0,
        };
        const targetDay = dayMap[match[0].toLowerCase()];
        const currentDay = today.getDay();
        const daysUntilTarget = (targetDay - currentDay + 7) % 7;
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysUntilTarget);
        filters.date = targetDate.toISOString().split("T")[0];
      }
      break;
    }
  }

  console.log("Parsed filters from prompt:", filters); // Debug log
  return filters;
};
