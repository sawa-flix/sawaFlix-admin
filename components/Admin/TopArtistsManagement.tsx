'use client';

import React, { useState, useEffect } from 'react';
import { 
  getTopArtists, 
  getArtistsDirectory, 
  saveTopArtists, 
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

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const results = await getArtistsDirectory(searchQuery.trim());
        setDirectory(results);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchResults = directory.filter(artist => {
    const isAlreadyAdded = topList.some(item => item.artist_id === artist.id);
    return !isAlreadyAdded;
  });

  const handleAddArtist = async (artist: Artist) => {
    setError(null);
    const activeCount = topList.filter(t => t.is_active).length;
    const willBeActive = activeCount < 20;

    const newItem: TopArtist = {
      id: `top-${Math.random().toString(36).substring(2, 9)}`,
      artist_id: artist.id,
      rank: topList.length + 1,
      added_at: new Date().toISOString(),
      is_active: willBeActive,
      artist
    };

    setTopList(prev => [...prev, newItem]);
    addNotification({
      type: 'approved',
      title: 'Artist Added',
      message: `${artist.name} was added to the curated list.`
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
    
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;

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
    <div className="space-y-6">
      {/* Search Directory Panel */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1">Search & Add Curated Artist</h2>
        <p className="text-xs text-slate-500 mb-4">Search Sawaflix's catalog to introduce artists to the curation list.</p>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Type artist name (e.g. Stanley, Charlotte)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-red-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder:text-slate-400"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        </div>

        {/* Directory Results dropdown/panel */}
        {searchResults.length > 0 && (
          <div className="mt-3 bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden max-h-60 overflow-y-auto shadow-sm">
            {searchResults.map(artist => (
              <div key={artist.id} className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <img 
                    src={artist.avatar_url} 
                    alt={artist.name} 
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{artist.name}</h4>
                    <p className="text-[11px] text-slate-400">{artist.region} • {artist.followers?.toLocaleString()} followers</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddArtist(artist)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl text-xs font-semibold border border-red-200 transition-all cursor-pointer"
                >
                  <Plus size={13} /> Add
                </button>
              </div>
            ))}
          </div>
        )}

        {searchQuery.trim().length > 0 && searchResults.length === 0 && (
          <p className="text-xs text-slate-400 mt-2">No remaining artists found matching "{searchQuery}".</p>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-start space-x-2">
          <AlertCircle className="shrink-0 mt-0.5" size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Main rankings table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Curated Rankings List</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                activeCount === 20 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
              }`}>
                {activeCount}/20 Active Artists
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Reorder rank structure. Changes are saved across the platform.</p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={loadData}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={13} /> Reset
            </button>
            <button
              onClick={handleSaveList}
              disabled={saving || topList.length === 0}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              {saving ? <Loader2 className="animate-spin" size={13} /> : <Save size={13} />}
              Save Configuration
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-red-600" size={24} />
            <span className="text-xs">Loading rankings configuration...</span>
          </div>
        ) : topList.length === 0 ? (
          <div className="p-12 text-center">
            <Star className="mx-auto text-slate-300 mb-3" size={36} />
            <h3 className="text-sm font-bold text-slate-900">No Curated Artists Added</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Use the search box above to add artists to the curation list and begin ranking them.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/75 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
                  <th className="px-5 py-3 w-16 text-center">Rank</th>
                  <th className="px-5 py-3">Artist</th>
                  <th className="px-5 py-3">Details</th>
                  <th className="px-5 py-3 w-28 text-center">Status</th>
                  <th className="px-5 py-3 w-32 text-center">Position</th>
                  <th className="px-5 py-3 w-16 text-center">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topList.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={`transition-colors hover:bg-slate-50/60 ${!item.is_active ? 'opacity-50' : ''}`}
                  >
                    {/* Rank Badge */}
                    <td className="px-5 py-3.5 font-bold text-center text-xs text-slate-700">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                        index < 3 
                          ? 'bg-red-600 text-white font-black' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {index + 1}
                      </span>
                    </td>

                    {/* Artist Image & Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.artist?.avatar_url} 
                          alt={item.artist?.name} 
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{item.artist?.name}</h4>
                          <p className="text-[10px] text-slate-400">{item.artist?.genres?.join(', ')}</p>
                        </div>
                      </div>
                    </td>

                    {/* Regions & Details */}
                    <td className="px-5 py-3.5 text-xs text-slate-500">
                      <div>Region: {item.artist?.region || 'Africa'}</div>
                      <div className="text-[10px] text-slate-400">{item.artist?.followers?.toLocaleString()} followers</div>
                    </td>

                    {/* Toggle Active status */}
                    <td className="px-5 py-3.5 text-center">
                      <button 
                        onClick={() => handleToggleActive(index)}
                        className={`focus:outline-none transition-colors cursor-pointer inline-flex ${
                          item.is_active ? 'text-emerald-500' : 'text-slate-300'
                        }`}
                      >
                        {item.is_active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                      </button>
                    </td>

                    {/* Reorder Position */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          disabled={index === 0}
                          onClick={() => moveItem(index, 'up')}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-600 rounded-lg transition-colors cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          disabled={index === topList.length - 1}
                          onClick={() => moveItem(index, 'down')}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-600 rounded-lg transition-colors cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>
                    </td>

                    {/* Remove Action */}
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => handleRemove(index)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove Artist"
                      >
                        <Trash2 size={14} />
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
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center space-x-2 mb-4 text-slate-500 border-b border-slate-100 pb-3">
            <History size={15} />
            <h3 className="text-xs font-bold text-slate-900">Audited Version Logs (top_artists_history)</h3>
          </div>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 text-xs">
            {history.map((log, idx) => (
              <div key={idx} className="flex justify-between gap-4 border-l-2 border-red-500/40 pl-3 py-0.5">
                <div>
                  <p className="text-slate-800 font-semibold">{log.event}</p>
                  <span className="text-[10px] text-slate-400">
                    Timestamp: {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">system_admin</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
