import { tool } from 'ai';
import { z } from 'zod';

// Simulación de análisis de sentimientos
const analyzeSentiment = (text: string) => {
  const positiveWords = [
    'good',
    'great',
    'excellent',
    'amazing',
    'wonderful',
    'love',
    'happy',
    'fantastic',
    'perfect',
    'beautiful',
  ];
  const negativeWords = [
    'bad',
    'terrible',
    'awful',
    'hate',
    'disappointing',
    'worst',
    'horrible',
    'sad',
    'angry',
    'frustrated',
  ];
  const neutralWords = [
    'okay',
    'fine',
    'normal',
    'average',
    'regular',
    'standard',
    'usual',
    'typical',
  ];

  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;

  words.forEach((word) => {
    if (positiveWords.some((pw) => word.includes(pw))) positiveCount++;
    else if (negativeWords.some((nw) => word.includes(nw))) negativeCount++;
    else if (neutralWords.some((nw) => word.includes(nw))) neutralCount++;
  });

  const total = positiveCount + negativeCount + neutralCount;

  if (total === 0) {
    return {
      sentiment: 'neutral',
      confidence: 0.5,
      score: 0,
      breakdown: { positive: 0, negative: 0, neutral: 1 },
    };
  }

  const score = (positiveCount - negativeCount) / total;
  let sentiment: 'positive' | 'negative' | 'neutral';
  let confidence: number;

  if (score > 0.2) {
    sentiment = 'positive';
    confidence = Math.min(0.9, 0.5 + Math.abs(score) * 0.4);
  } else if (score < -0.2) {
    sentiment = 'negative';
    confidence = Math.min(0.9, 0.5 + Math.abs(score) * 0.4);
  } else {
    sentiment = 'neutral';
    confidence = Math.min(0.9, 0.5 + (1 - Math.abs(score)) * 0.4);
  }

  return {
    sentiment,
    confidence,
    score,
    breakdown: {
      positive: positiveCount / total,
      negative: negativeCount / total,
      neutral: neutralCount / total,
    },
  };
};

export const analyzeSentimentTool = tool({
  description:
    'Analyze the sentiment of text to determine if it is positive, negative, or neutral',
  inputSchema: z.object({
    text: z.string().describe('The text to analyze for sentiment'),
    language: z
      .string()
      .optional()
      .default('en')
      .describe('Language of the text (ISO code)'),
    detailed: z
      .boolean()
      .optional()
      .default(true)
      .describe('Whether to return detailed analysis'),
  }),
  execute: async ({ text, language = 'en', detailed = true }) => {
    // Simular delay de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    const analysis = analyzeSentiment(text);

    // Detectar emociones específicas
    const emotions: Array<{ emotion: string; intensity: number }> = [];
    const emotionKeywords = {
      joy: ['happy', 'joy', 'excited', 'thrilled', 'delighted'],
      sadness: ['sad', 'depressed', 'melancholy', 'sorrow', 'grief'],
      anger: ['angry', 'furious', 'mad', 'irritated', 'annoyed'],
      fear: ['afraid', 'scared', 'terrified', 'worried', 'anxious'],
      surprise: ['surprised', 'shocked', 'amazed', 'astonished', 'stunned'],
      love: ['love', 'adore', 'cherish', 'affection', 'passion'],
      disgust: ['disgusted', 'revolted', 'repulsed', 'sickened', 'appalled'],
    };

    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      const count = keywords.filter((keyword) =>
        text.toLowerCase().includes(keyword),
      ).length;
      if (count > 0) {
        emotions.push({ emotion, intensity: count / keywords.length });
      }
    });

    // Ordenar emociones por intensidad
    emotions.sort((a, b) => b.intensity - a.intensity);

    const result = {
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      language,
      sentiment: analysis.sentiment,
      confidence: analysis.confidence,
      score: analysis.score,
      wordCount: text.split(/\s+/).length,
      characterCount: text.length,
      analysisTime: new Date().toISOString(),
    };

    if (detailed) {
      return {
        ...result,
        breakdown: analysis.breakdown,
        emotions: emotions.slice(0, 3), // Top 3 emotions
        suggestions: generateSuggestions(analysis.sentiment, analysis.score),
      };
    }

    return result;
  },
});

function generateSuggestions(sentiment: string, score: number): string[] {
  const suggestions = [];

  if (sentiment === 'positive' && score > 0.7) {
    suggestions.push('This text shows strong positive sentiment');
    suggestions.push('Consider using this for testimonials or reviews');
  } else if (sentiment === 'negative' && score < -0.7) {
    suggestions.push('This text shows strong negative sentiment');
    suggestions.push('Consider addressing concerns or providing support');
  } else if (sentiment === 'neutral') {
    suggestions.push('This text is neutral in tone');
    suggestions.push('Consider adding more emotional context if needed');
  }

  if (Math.abs(score) < 0.3) {
    suggestions.push('Sentiment is mixed - consider clarifying the message');
  }

  return suggestions;
}
