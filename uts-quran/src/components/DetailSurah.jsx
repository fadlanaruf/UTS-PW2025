import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DetailSurah = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surahDetail, setSurahDetail] = useState(null);
  const [verses, setVerses] = useState([]);
  const [surahInfo, setSurahInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [surahResponse, versesResponse, infoResponse] = await Promise.all([
          fetch(`https://api.quran.com/api/v4/chapters/${id}`),
          fetch(`https://api.quran.com/api/v4/verses/by_chapter/${id}?translations=33&fields=text_uthmani,verse_key`),
          fetch(`https://api.quran.com/api/v4/chapters/${id}/info?language=id`)
        ]);

        const surahData = await surahResponse.json();
        const versesData = await versesResponse.json();
        const infoData = await infoResponse.json();

        setSurahDetail(surahData.chapter);
        setVerses(versesData.verses);
        setSurahInfo(infoData.chapter_info);
      } catch (error) {
        setError('Gagal mengambil data surah.');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const removeSupTags = (text) => {
    if (!text) return '';
    return text.replace(/<sup[^>]*>.*?<\/sup>/g, '');
  };

  if (loading) {
    return <div className="text-center py-8 text-2xl">Memuat detail surah...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500 text-2xl">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Tombol Kembali */}
      <button 
        onClick={() => navigate('/')}
        className="mb-6 flex items-center text-white hover:text-cyan-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Kembali ke Daftar Surah
      </button>

      {/* Header Surah */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-emerald-800 mb-4 font-arabic">
          {surahDetail.name_arabic}
        </h1>
        <p className="text-gray-600 text-2xl">Surah ke-{surahDetail.id}: {surahDetail.name_simple}</p>
      </div>

      {/* Informasi Surah */}
      <div className="bg-gray-50 p-5 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-700 text-lg mb-2">
              <span className="font-semibold">Tempat Turun:</span> {surahDetail.revelation_place === 'makkah' ? 'Makkiyah' : 'Madaniyah'}
            </p>
            <p className="text-gray-700 text-lg mb-2">
              <span className="font-semibold">Jumlah Ayat:</span> {surahDetail.verses_count}
            </p>
          </div>
          <div>
            {surahInfo && (
              <p className="text-gray-700 text-lg">
                <span className="font-semibold">Nama Lain:</span> {surahInfo.name || '-'}
              </p>
            )}
          </div>
        </div>
      </div>

      
      <div className="relative my-8 text-center">
        <div className="border-t-2 border-emerald-300 absolute top-1/2 left-0 right-0"></div>
        <div className="relative inline-block bg-white px-6">
          <p className="text-5xl font-arabic text-emerald-700 mb-2 leading-tight">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-black font-bold text-xl">
            Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
          </p>
        </div>
      </div>

    
      {surahInfo && surahInfo.text && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Penjelasan Surah</h2>
          <div 
            className="text-gray-800 text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: removeSupTags(surahInfo.text) }}
          />
        </div>
      )}

      {/* Daftar Ayat */}
      <div className="space-y-8">
        {verses.map((verse) => {
          const verseNumber = verse.verse_key.split(':')[1];
          return (
            <div key={verse.id} className="group">
              <div className="flex flex-col">
                {/* Arabic Verse */}
                <div className="flex justify-end">
                  <p className="text-4xl font-arabic text-gray-800 leading-loose mb-4 text-right">
                    {verse.text_uthmani}
                  </p>
                </div>
                
                {/* Translation */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1 w-10 h-10 bg-blue-200 text-blue-800 
                                transform rotate-45 flex items-center justify-center">
                    <span className="transform rotate-[-45deg] text-lg font-bold">
                      {verseNumber}
                    </span>
                  </div>
                  <p className="text-black font-bold text-xl text-left flex-grow">
                    {removeSupTags(verse.translations[0]?.text)}
                  </p>
                </div>
              </div>
              
              {/* Garis pemisah */}
              {verseNumber < surahDetail.verses_count && (
                <div className="border-t-2 border-dashed border-gray-300 mt-6 pt-6"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailSurah;