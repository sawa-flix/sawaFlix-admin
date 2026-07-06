'use client';

import React, { useState, useEffect } from 'react';
import { 
  getTopArtists, 
  getArtistsDirectory, 
  saveTopArtists, 
  addArtistToTop20,
  getHistoryLog,
  Artist, 
  TopArtist 
} from '@/services/adminContentService';
import { useAdminNotifications } from '@/contexts/AdminNotificationContext';
import { 
  Search, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Save, 
  History, 
  Loader2, 
  Star, 
  ToggleLeft, 
  ToggleRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function TopArtistsManagement() {
  const [topList, setTopList] = useState<TopArtist[]>([]);
  const [directory, setDirectory] = useState<Artist[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { addNotification } = useAdminNotifications();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, dir, logs] = await Promise.all([
        getTopArtists(),
        getArtistsDirectory(''),
        getHistoryLog()
      ]);
      setTopList(list);
      setDirectory(dir);
      setHistory(logs);
    } catch (err) {
      console.error("Failed to load top artists data:", err);
      setError("Failed to load artists directory.");
    } finally {
      setLoading(false);
    }
  };

  // Debounced backend search
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const results = await getArtistsDirectory(searchQuery.trim());
        setDirectory(results);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
      }
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter out artists already in the top list for search results
  // We no longer require the search string to match here, since the backend handles search filtering.
  const searchResults = directory.filter(artist => {
    const isAlreadyAdded = topList.some(item => item.artist_id === artist.id);
    return !isAlreadyAdded;
  });

  const handleAddArtist = async (artist: Artist) => {
    setError(null);
    const activeCount = topList.filter(t => t.is_active).length;
    
    // Auto-set active status based on limit
    const willBeActive = activeCount < 20;

    const newItem: TopArtist = {
      id: `top-${Math.random().toString(36).substring(2, 9)}`,
      artist_id: artist.id,
      rank: topList.length + 1,
      added_at: new Date().toISOString(),
      is_active: willBeActive,
      artist
    };

    const newList = [...topList, newItem];
    setTopList(newList);
    setSearchQuery('');
    
    addNotification({
      type: 'info',
      title: 'Artist Added',
      message: `${artist.name} has been added to the curation list (Rank #${newItem.rank}).`
    });
  };

  const handleToggleActive = (index: number) => {
    setError(null);
    const item = topList[index];
    const isActivating = !item.is_active;

    if (isActivating) {
      const activeCount = topList.filter(t => t.is_active).length;
      if (activeCount >= 20) {
        setError('Maximum of 20 active curated artists allowed. Deactivate another artist first.');
        addNotification({
          type: 'rejected',
          title: 'Activation Limit Reached',
          message: 'You cannot have more than 20 active curated artists at one time.'
        });
        return;
      }
    }

    const newList = [...topList];
    newList[index] = {
      ...item,
      is_active: isActivating
    };
    setTopList(newList);
  };

  const handleRemove = (index: number) => {
    setError(null);
    const artistName = topList[index].artist?.name || 'Artist';
    const newList = topList.filter((_, idx) => idx !== index).map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));
    
    setTopList(newList);
    addNotification({
      type: 'info',
      title: 'Artist Removed',
      message: `${artistName} was removed from the curated list.`
    });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    setError(null);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === topList.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newList = [...topList];
    
    // Swap items
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;

    // Recalculate ranks
    const finalReordered = newList.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

    setTopList(finalReordered);
  };

  const handleSaveList = async () => {
    setSaving(true);
    setError(null);
    try {
      await saveTopArtists(topList);
      const logs = await getHistoryLog();
      setHistory(logs);
      addNotification({
        type: 'approved',
        title: 'Curation Saved',
        message: 'Top Artists rankings and states saved successfully.'
      });
    } catch (err: any) {
      setError(err.message || 'Failed to save rankings.');
    } finally {
      setSaving(false);
    }
  };

  const activeCount = topList.filter(t => t.is_active).length;

  return (
    <div className="space-y-8">
      {/* Search Directory Panel */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-lg font-bold text-white mb-2">Search & Add Curated Artist</h2>
        <p className="text-xs text-gray-400 mb-4">Search Sawaflix's catalog to introduce artists to the curation list.</p>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Type artist name (e.g. Stanley, Charlotte)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 focus:border-red-500 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        </div>

        {/* Directory Results dropdown/panel (Shows if there are results, even if query is empty) */}
        {searchResults.length > 0 && (
          <div className="mt-3 bg-gray-950 border border-gray-800 rounded-xl divide-y divide-gray-900 overflow-hidden max-h-60 overflow-y-auto z-10 animate-in fade-in slide-in-from-top-1 duration-150">
            {searchResults.map(artist => (
              <div key={artist.id} className="flex items-center justify-between p-3 hover:bg-gray-900 transition-colors">
                <div className="flex items-center space-x-3">
                  <img 
                    src={artist.avatar_url} 
                    alt={artist.name} 
                    className="w-9 h-9 rounded-full object-cover border border-gray-800"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{artist.name}</h4>
                    <p className="text-xs text-gray-500">{artist.region} • {artist.followers?.toLocaleString()} followers</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddArtist(artist)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus size={14} /> Add to Top Artists
                </button>
              </div>
            ))}
          </div>
        )}

        {searchQuery.trim().length > 0 && searchResults.length === 0 && (
          <p className="text-xs text-gray-500 mt-2">No remaining artists found matching "{searchQuery}".</p>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm flex items-start space-x-2">
          <AlertCircle className="shrink-0 mt-0.5" size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Main rankings table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Curated Rankings List</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                activeCount === 20 ? 'bg-green-600/20 text-green-500 border border-green-500/20' : 'bg-yellow-600/20 text-yellow-500 border border-yellow-500/20'
              }`}>
                {activeCount}/20 Active Artists
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Reorder rank structure. Changes are logged in top_artists_history.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={loadData}
              className="px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={14} /> Reset Changes
            </button>
            <button
              onClick={handleSaveList}
              disabled={saving || topList.length === 0}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-red-900/20 cursor-pointer"
            >
              {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              Save Configuration
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-red-500" size={28} />
            <span className="text-sm">Loading rankings configuration...</span>
          </div>
        ) : topList.length === 0 ? (
          <div className="p-12 text-center">
            <Star className="mx-auto text-gray-700 mb-4" size={40} />
            <h3 className="text-base font-bold text-white">No Curated Artists Added</h3>
            <p className="text-xs text-gray-500 mt-1.5 max-w-sm mx-auto">
              Use the search box above to add artists to the curation dashboard and begin ranking them.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-950 text-gray-500 text-[10px] uppercase font-bold tracking-wider border-b border-gray-800">
                  <th className="px-6 py-3.5 w-16 text-center">Rank</th>
                  <th className="px-6 py-3.5">Artist</th>
                  <th className="px-6 py-3.5">Details</th>
                  <th className="px-6 py-3.5 w-28 text-center">Status</th>
                  <th className="px-6 py-3.5 w-32 text-center">Position</th>
                  <th className="px-6 py-3.5 w-16 text-center">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {topList.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={`transition-colors hover:bg-gray-800/20 ${!item.is_active ? 'opacity-50' : ''}`}
                  >
                    {/* Rank Badge */}
                    <td className="px-6 py-4 font-bold text-center text-sm text-gray-300">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                        index < 3 
                          ? 'bg-red-600 text-white font-black' 
                          : 'bg-gray-800 text-gray-400'
                      }`}>
                        {index + 1}
                      </span>
                    </td>

                    {/* Artist Image & Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.artist?.avatar_url} 
                          alt={item.artist?.name} 
                          className="w-10 h-10 rounded-full object-cover border border-gray-800 shrink-0"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white">{item.artist?.name}</h4>
                          <p className="text-[10px] text-gray-500">{item.artist?.genres?.join(', ')}</p>
                        </div>
                      </div>
                    </td>

                    {/* Regions & Details */}
                    <td className="px-6 py-4 text-xs text-gray-400">
                      <div>Region: {item.artist?.region}</div>
                      <div className="text-[10px] text-gray-500">{item.artist?.followers?.toLocaleString()} followers</div>
                    </td>

                    {/* Toggle Active status */}
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleToggleActive(index)}
                        className={`focus:outline-none transition-colors cursor-pointer inline-flex ${
                          item.is_active ? 'text-green-500' : 'text-gray-600'
                        }`}
                      >
                        {item.is_active ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                      </button>
                    </td>

                    {/* Reorder Position */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          disabled={index === 0}
                          onClick={() => moveItem(index, 'up')}
                          className="p-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-gray-800 text-gray-400 hover:text-white rounded transition-colors cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          disabled={index === topList.length - 1}
                          onClick={() => moveItem(index, 'down')}
                          className="p-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-gray-800 text-gray-400 hover:text-white rounded transition-colors cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </td>

                    {/* Remove Action */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleRemove(index)}
                        className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                        title="Remove Artist"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-4 text-gray-400 border-b border-gray-800 pb-3">
            <History size={16} />
            <h3 className="text-sm font-bold text-white">Audited Version Logs (top_artists_history)</h3>
          </div>
          <div className="space-y-3.5 max-h-48 overflow-y-auto pr-2">
            {history.map((log, idx) => (
              <div key={idx} className="text-xs flex justify-between gap-4 border-l border-red-500/30 pl-3 py-0.5">
                <div>
                  <p className="text-gray-300 font-semibold">{log.event}</p>
                  <span className="text-[10px] text-gray-500">
                    Timestamp: {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-gray-600 font-mono">system_admin</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
