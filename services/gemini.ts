/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Using gemini-3-pro-preview for complex design and coding tasks.
const GEMINI_MODEL = 'gemini-3-pro-preview';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert Senior Mobile Product Designer and Frontend Engineer.
Your goal is to generate a comprehensive **Mobile App Design System** in a single HTML file.

*** CORE OUTPUT REQUIREMENTS ***
1. **Single HTML File**: Return ONLY raw HTML with embedded CSS (<style>) and JavaScript (<script>).
2. **Dual-Mode Display**:
   The HTML must support two distinct views, toggled via a floating action button (FAB) in the bottom-right corner:
   - **Design Board (Default)**: 
     - Show ALL generated screens simultaneously in a responsive grid layout.
     - Each screen must be wrapped in a stylized "Phone Frame" (Apple/Android style with notch, rounded corners, shadow).
     - Background: Dot/Grid pattern (Figma style).
     - This allows the user to see the entire app flow at once.
   - **Interactive Prototype**:
     - Show ONLY the active screen (centered, full height).
     - Hide the others.
     - Enable interactive navigation between screens.
3. **Structured Design Prompt Export**:
   - You MUST generate a detailed text description of the design you created (color palette hex codes, typography, spacing rules, component hierarchy, list of screens).
   - Embed this text inside a hidden script tag: \`<script id="design-prompt-data" type="text/plain">...PROMPT HERE...</script>\`.
   - This text should be high-quality enough that pasting it into another AI would reproduce this design.

*** REQUIRED APP ARCHITECTURE ***
Generate a complete flow with at least these screens (adapt content to the user's prompt):
1. **Splash Screen**: Brand logo, animated entrance.
2. **Onboarding**: 3-slide carousel with "Next/Skip".
3. **Auth**: Login & Sign Up screens.
4. **Main Tab: Home**: Dashboard, Feed, or Primary Action area.
5. **Main Tab: Search/Explore**: Grid or List view of items.
6. **Main Tab: Profile**: User avatar, stats, settings links.
7. **Detail View**: A specific item/post detail page (accessed from Home/Search).
8. **Action/Modal**: A specific action screen (e.g., Checkout, Create Post, Edit).

*** VISUAL DESIGN SYSTEM ***
- **Framework**: Tailwind CSS (CDN).
- **Style**: Premium, Modern, Clean. Use ample whitespace, subtle shadows, and consistent border-radius.
- **Colors**: Auto-generate a professional palette based on the niche (e.g., Medical = Teal/White; Fashion = Monochrome; Gaming = Dark/Neon).
- **Typography**: Inter, Poppins, or SF Pro styling.

*** INTERACTIVITY ***
- The "Design Board" view is for looking.
- The "Prototype" view is for clicking.
- Ensure all "Back" buttons work.
- Ensure Tab Bar navigation works.

*** CODE STRUCTURE ***
- Use semantic HTML.
- Use a simple state manager in JS to handle \`currentScreen\` and \`viewMode\`.
- Images: Use abstract CSS shapes, gradients, or reliable placeholder services (placehold.co). Avoid broken images.

RETURN ONLY THE RAW HTML CODE STARTING WITH <!DOCTYPE html>.
`;

export async function bringToLife(prompt: string, fileBase64?: string, mimeType?: string): Promise<string> {
  const parts: any[] = [];
  
  // INTELLIGENT PROMPT ENHANCEMENT
  let appCategory = "General Utility";
  let designSystem = "Clean, Neutral, Minimalist";
  let specificFeatures = "Standard dashboard and list views.";

  const p = prompt.toLowerCase();
  
  // Enhanced detection logic
  if (p.includes("finance") || p.includes("bank") || p.includes("crypto") || p.includes("wallet") || p.includes("expense")) {
    appCategory = "Fintech";
    designSystem = "Trustworthy, Dark Mode capable, Sharp contrasts. Primary: Deep Blue or Emerald.";
    specificFeatures = "Spending graphs (CSS bars), transaction lists, 'Send Money' flow, card management.";
  } else if (p.includes("social") || p.includes("chat") || p.includes("connect")) {
    appCategory = "Social";
    designSystem = "Vibrant, Friendly, Rounded. Primary: Indigo or Pink.";
    specificFeatures = "Stories carousel, Feed with cards, Chat interface, User profiles with stats.";
  } else if (p.includes("shop") || p.includes("commerce") || p.includes("store")) {
    appCategory = "E-Commerce";
    designSystem = "Product-first, clean whites/grays. Primary: Black or Brand Color.";
    specificFeatures = "Product grids, sticky 'Add to Cart', Checkout flow with credit card form.";
  } else if (p.includes("health") || p.includes("fit") || p.includes("meditat")) {
    appCategory = "Health";
    designSystem = "Calm, Soft gradients, rounded cards. Primary: Sage Green or Ocean Blue.";
    specificFeatures = "Progress rings, activity charts, daily checklists, mindfulness player.";
  }

  let finalPrompt = `
  *** APP DESIGN REQUEST ***
  
  USER IDEA: "${prompt}"
  
  CATEGORY: ${appCategory}
  DESIGN STYLE: ${designSystem}
  KEY FEATURES: ${specificFeatures}
  
  INSTRUCTIONS:
  1. Generate a "Design Board" view showing ALL screens: Splash, Onboarding(x3), Auth, Home, Search, Detail, Profile, Settings.
  2. Implement the "Dual-Mode" toggle (Grid vs Prototype).
  3. Ensure the CSS makes the Grid View look like a professional Figma/Dribbble presentation (screens in phone frames).
  4. Ensure the Prototype View feels like a real native app.
  5. DON'T FORGET the <script id="design-prompt-data">...</script> with the detailed prompt description.
  
  GENERATE THE FULL HTML NOW.
  `;

  parts.push({ text: finalPrompt });

  if (fileBase64 && mimeType) {
    parts.push({
      inlineData: {
        data: fileBase64,
        mimeType: mimeType,
      },
    });
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Higher creativity for design variety
      },
    });

    let text = response.text || "<!-- Failed to generate content -->";
    text = text.replace(/^```html\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');

    return text;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}