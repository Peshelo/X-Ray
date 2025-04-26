"use client";
import { useState, useRef, useEffect } from 'react';

export default function TranslationPage() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('sn'); // Default: Shona
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef(null);

  // Supported languages with voice codes
  const languages = [
    { code: 'en', name: 'English', voiceCode: 'en-US' },
    { code: 'sn', name: 'Shona', voiceCode: 'en-US' }, // Fallback to English voice
    { code: 'nd', name: 'Ndebele', voiceCode: 'en-US' }, // Fallback to English voice
    { code: 'fr', name: 'French', voiceCode: 'fr-FR' },
    { code: 'zu', name: 'Zulu', voiceCode: 'zu-ZA' }, // Closest to Ndebele
  ];

  // Initialize speech synthesis
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const translateText = async () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);
    setTranslatedText('');

    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
          inputText
        )}`
      );
      const data = await response.json();
      setTranslatedText(data[0][0][0]);
    } catch (err) {
      setTranslatedText('Translation failed. Try again later.');
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  };

  const speakText = () => {
    if (!translatedText || !synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    // Find the selected language's voice code
    const language = languages.find(lang => lang.code === targetLang);
    const voiceCode = language?.voiceCode || 'en-US';

    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = voiceCode;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-bold text-center mb-4">Translate + Speak</h1>

        {/* Input Text */}
        <textarea
          className="w-full p-2 border rounded mb-4"
          rows={3}
          placeholder="Enter text..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        {/* Language Selection */}
        <div className="flex gap-4 mb-4">
          <select
            className="flex-1 p-2 border rounded"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>

          <select
            className="flex-1 p-2 border rounded"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Translate Button */}
        <button
          onClick={translateText}
          disabled={isTranslating}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 mb-4"
        >
          {isTranslating ? 'Translating...' : 'Translate'}
        </button>

        {/* Translation Result */}
        {translatedText && (
          <div className="mb-4">
            <div className="p-3 border rounded bg-gray-50 mb-2">
              <p>{translatedText}</p>
            </div>
            <button
              onClick={speakText}
              disabled={isSpeaking}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {isSpeaking ? (
                'Speaking...'
              ) : (
                <>
                  <span>🔊</span> Speak Translation
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}