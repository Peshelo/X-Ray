"use client";
import { useState, useRef } from 'react';

export default function AudioTranslator() {
  const audioRef = useRef(null);
  
  // Reorganized data structure with English as primary key
  const phraseBank = [
    {
      english: "Remove metallic clothing",
      translations: {
        shona: { text: "Bvisai mbatya dzine simbi", audio: "/audio/shona/Bvisai mbatya dzine simbi.m4a" },
        ndebele: { text: "Remove metallic clothing (Ndebele)", audio: "/audio/ndebele/metallic_clothing.m4a" }
      },
      category: "instructions"
    },
    {
      english: "Breathe normally",
      translations: {
        shona: { text: "Femera zvakajairika", audio: "/audio/shona/Chifemai Zvakanaka.m4a" },
        ndebele: { text: "Breathe normally (Ndebele)", audio: "/audio/ndebele/breathe_normal.m4a" }
      },
      category: "breathing"
    },
    {
      english: "Breathe out and hold",
      translations: {
        shona: { text: "Femerai kunze momira kufema", audio: "/audio/shona/Femerai kunze momira kufema.m4a" },
        ndebele: { text: "Breathe out and hold (Ndebele)", audio: "/audio/ndebele/Breath out (ndebele).m4a" }
      },
      category: "breathing"
    },
    {
      english: "Breathe in and hold",
      translations: {
        shona: { text: "Femerai mukati muchengete", audio: "/audio/shona/Femerai mukati muchengete.m4a" },
        ndebele: { text: "Breathe in and hold (Ndebele)", audio: "/audio/ndebele/Breath in(ndebele).m4a" }
      },
      category: "breathing"
    },
    {
      english: "Don't move",
      translations: {
        shona: { text: "Musafamba famba", audio: "/audio/shona/Musafamba famba.m4a" },
        ndebele: { text: "Stay still (Ndebele)", audio: "/audio/ndebele/Stay still (ndebele).m4a" }
      },
      category: "movement"
    },
    {
      english: "Raise your chin",
      translations: {
        shona: { text: "Simudzirai Chirebvu Chenyu", audio: "/audio/shona/Simudzirai Chirebvu Chenyu.m4a" },
        ndebele: { text: "Raise your chin (Ndebele)", audio: "/audio/ndebele/Raise your chin(isindebele).m4a" }
      },
      category: "positioning"
    }
  ];

  const categories = [
    { id: "all", name: "All Phrases" },
    { id: "instructions", name: "Instructions" },
    { id: "breathing", name: "Breathing" },
    { id: "movement", name: "Movement" },
    { id: "positioning", name: "Positioning" }
  ];

  const languages = [
    { id: "english", name: "English" },
    { id: "shona", name: "Shona" },
    { id: "ndebele", name: "Ndebele" }
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("shona");
  const [nowPlaying, setNowPlaying] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const playAudio = (audioSrc, englishText) => {
    if (audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.play();
      setNowPlaying(englishText);
      
      audioRef.current.onended = () => {
        setNowPlaying(null);
      };
    }
  };

  const filteredPhrases = phraseBank.filter(phrase => {
    const matchesCategory = selectedCategory === "all" || phrase.category === selectedCategory;
    const matchesSearch = phrase.english.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">Medical Communication Tool</h1>
          <p className="text-blue-100">For Zimbabwean Healthcare Providers</p>
        </div>

        {/* Controls */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Search Phrases</label>
              <input
                type="text"
                placeholder="Search English phrases..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Category</label>
              <select 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Output Language</label>
              <select 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {languages.map(language => (
                  <option key={language.id} value={language.id}>{language.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Phrases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {filteredPhrases.length > 0 ? (
            filteredPhrases.map((phrase, index) => {
              const translation = phrase.translations[selectedLanguage] || {};
              return (
                <div 
                  key={index}
                  className={`bg-gray-50 rounded-lg p-4 border hover:border-blue-300 transition-all cursor-pointer
                    ${nowPlaying === phrase.english ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                  onClick={() => playAudio(translation.audio || "", phrase.english)}
                >
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{phrase.english}</h3>
                  {translation.text && (
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedLanguage === "english" ? "" : translation.text}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {phrase.category}
                    </span>
                    <button 
                      className={`px-3 py-1 rounded-full text-sm ${
                        nowPlaying === phrase.english 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-blue-600 border border-blue-300'
                      }`}
                    >
                      {nowPlaying === phrase.english ? 'Playing...' : 'Play'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No phrases found matching your search
            </div>
          )}
        </div>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} />
      </div>
    </div>
  );
}