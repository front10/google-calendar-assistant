'use client';

import React from 'react';
import { BarChart3, Smile, Frown, Meh, Lightbulb, Clock } from 'lucide-react';

// Loading state
export const SentimentAnalyzerLoading: React.FC<{
  input?: { text: string };
}> = ({ input: _input }) => (
  <div className="animate-pulse bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center space-x-3 mb-4">
      <div className="bg-purple-100 rounded-lg size-12 flex items-center justify-center">
        <BarChart3 className="size-6 text-purple-600" />
      </div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>

    <div className="space-y-4">
      <div className="h-20 bg-gray-200 rounded" />
      <div className="flex space-x-4">
        <div className="flex-1 h-8 bg-gray-200 rounded" />
        <div className="flex-1 h-8 bg-gray-200 rounded" />
        <div className="flex-1 h-8 bg-gray-200 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-4/6" />
      </div>
    </div>

    <div className="mt-4 flex items-center space-x-2">
      <Clock className="size-4 text-gray-400" />
      <span className="text-sm text-gray-500">Analyzing sentiment...</span>
    </div>
  </div>
);

// Success state
export const SentimentAnalyzer: React.FC<{
  output: {
    text: string;
    language: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    score: number;
    wordCount: number;
    characterCount: number;
    analysisTime: string;
    breakdown: { positive: number; negative: number; neutral: number };
    emotions: Array<{ emotion: string; intensity: number }>;
    suggestions: string[];
  };
  input?: { text: string };
}> = ({ output, input: _input }) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="size-6 text-green-600" />;
      case 'negative':
        return <Frown className="size-6 text-red-600" />;
      default:
        return <Meh className="size-6 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-100';
      case 'negative':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-600';
    if (confidence > 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-purple-100 rounded-lg size-12 flex items-center justify-center">
          <BarChart3 className="size-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">Sentiment Analysis</h3>
          <p className="text-gray-600 text-sm">
            {output.wordCount} words • {output.characterCount} characters
          </p>
        </div>
      </div>

      {/* Text preview */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700 italic">
          &ldquo;{output.text}&rdquo;
        </p>
      </div>

      {/* Sentiment result */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getSentimentIcon(output.sentiment)}
          <div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(
                output.sentiment,
              )}`}
            >
              {output.sentiment.charAt(0).toUpperCase() +
                output.sentiment.slice(1)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div
            className={`text-lg font-bold ${getConfidenceColor(
              output.confidence,
            )}`}
          >
            {(output.confidence * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500">Confidence</div>
        </div>
      </div>

      {/* Sentiment score bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Negative</span>
          <span>Neutral</span>
          <span>Positive</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-red-500 via-gray-400 to-green-500 h-2 rounded-full"
            style={{
              background: `linear-gradient(to right, 
                #ef4444 0%, #ef4444 ${Math.max(0, -output.score) * 50}%, 
                #9ca3af ${Math.max(0, -output.score) * 50}%, #9ca3af ${
                  Math.max(0, -output.score) * 50 + 20
                }%, 
                #22c55e ${Math.max(0, -output.score) * 50 + 20}%, #22c55e 100%)`,
            }}
          />
        </div>
        <div className="text-center text-xs text-gray-500 mt-1">
          Score: {output.score.toFixed(2)}
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">
            {(output.breakdown.positive * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500">Positive</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-600">
            {(output.breakdown.neutral * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500">Neutral</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-600">
            {(output.breakdown.negative * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500">Negative</div>
        </div>
      </div>

      {/* Emotions */}
      {output.emotions.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">Detected Emotions</h4>
          <div className="flex flex-wrap gap-2">
            {output.emotions.map((emotion, index) => (
              <span
                key={`${emotion.emotion}-${index}`}
                className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
              >
                {emotion.emotion} ({(emotion.intensity * 100).toFixed(0)}%)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {output.suggestions.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="size-4 text-yellow-500" />
            <h4 className="font-medium text-sm">Suggestions</h4>
          </div>
          <ul className="space-y-1">
            {output.suggestions.map((suggestion, _index) => (
              <li
                key={`suggestion-${crypto.randomUUID()}`}
                className="text-sm text-gray-600 flex items-start space-x-2"
              >
                <span className="text-yellow-500 mt-1">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-xs text-gray-500 mt-4">
        Language: {output.language.toUpperCase()} •{' '}
        {new Date(output.analysisTime).toLocaleTimeString()}
      </div>
    </div>
  );
};

// Error state
export const SentimentAnalyzerError: React.FC<{
  error: string;
  input?: { text: string };
}> = ({ error, input }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
    <div className="flex items-center space-x-3">
      <div className="bg-red-100 rounded-lg size-12 flex items-center justify-center">
        <BarChart3 className="size-6 text-red-600" />
      </div>
      <div>
        <h3 className="font-semibold text-red-800">
          Sentiment Analysis Failed
        </h3>
        <p className="text-red-600 text-sm">{error}</p>
        {input && (
          <p className="text-red-500 text-xs mt-1">
            Text: &ldquo;{input.text.substring(0, 50)}...&rdquo;
          </p>
        )}
      </div>
    </div>
  </div>
);
