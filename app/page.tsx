'use client';

import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Clock, 
  History, 
  Copy, 
  CheckCircle2, 
  ChevronRight, 
  Heart, 
  Sparkles, 
  Gift, 
  Share2, 
  Download, 
  X,
  Smile,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  Camera,
  Upload
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '@/lib/utils';
import AdBanner from '@/components/AdBanner';

interface WishHistoryItem {
  id: string;
  name: string;
  date: string;
  expiry: string;
  status: string;
  url: string;
  message: string;
  timestamp: number;
}

export default function SenderDashboard() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [expiry, setExpiry] = useState('3h');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [history, setHistory] = useState<WishHistoryItem[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const [includeAlbum, setIncludeAlbum] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [albumMoments, setAlbumMoments] = useState([
    { imageUrl: '', caption: '' },
    { imageUrl: '', caption: '' },
    { imageUrl: '', caption: '' },
    { imageUrl: '', caption: '' },
  ]);

  // Load history from localStorage on mount and start a real-time countdown interval
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('peach_wish_history');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setTimeout(() => {
            setHistory(parsed);
          }, 0);
        } catch (e) {
          console.error('Error loading history', e);
        }
      }
      setTimeout(() => {
        setCurrentTime(Date.now());
      }, 0);
    }

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isExpired = (itemExpiry: string, timestamp: number) => {
    if (itemExpiry === 'never') return false;
    if (currentTime === 0) return false;
    let duration = 0;
    if (itemExpiry === '1h') duration = 60 * 60 * 1000;
    else if (itemExpiry === '3h') duration = 3 * 60 * 60 * 1000;
    else if (itemExpiry === '6h') duration = 6 * 60 * 60 * 1000;
    else if (itemExpiry === '12h') duration = 12 * 60 * 60 * 1000;
    else if (itemExpiry === '24h') duration = 24 * 60 * 60 * 1000;
    else if (itemExpiry === '7d') duration = 7 * 24 * 60 * 60 * 1000;
    else duration = 24 * 60 * 60 * 1000; // Safe fallback so links never expire instantly
    return currentTime > timestamp + duration;
  };

  const getExpiryCountdown = (itemExpiry: string, timestamp: number) => {
    if (itemExpiry === 'never') return 'Never Expires';
    if (currentTime === 0) return 'Calculating...';
    
    let duration = 0;
    if (itemExpiry === '1h') duration = 60 * 60 * 1000;
    else if (itemExpiry === '3h') duration = 3 * 60 * 60 * 1000;
    else if (itemExpiry === '6h') duration = 6 * 60 * 60 * 1000;
    else if (itemExpiry === '12h') duration = 12 * 60 * 60 * 1000;
    else if (itemExpiry === '24h') duration = 24 * 60 * 60 * 1000;
    else if (itemExpiry === '7d') duration = 7 * 24 * 60 * 60 * 1000;
    else duration = 24 * 60 * 60 * 1000; // Safe fallback
    
    const timeRemaining = (timestamp + duration) - currentTime;
    
    if (timeRemaining <= 0) return 'Expired';
    
    const seconds = Math.floor((timeRemaining / 1000) % 60);
    const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
    const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
    
    return parts.join(' ');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      const cleanName = name.trim() || '97';
      const cleanMessage = message.trim();
      
      if (includeAlbum) {
        const uploadedCount = albumMoments.filter(m => m.imageUrl && m.imageUrl.trim() !== '').length;
        if (uploadedCount === 0) {
          alert('Please upload at least 1 memory photo for your album or turn off the album switch!');
          setIsGenerating(false);
          return;
        }
      }

      const res = await fetch('/api/wishes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: cleanName,
          message: cleanMessage,
          expiry,
          album: includeAlbum ? albumMoments.filter(m => m.imageUrl && m.imageUrl.trim() !== '') : undefined
        }),
      });
      
      const data = await res.json();
      
      if (data.id) {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://peachwish.com';
        const finalUrl = `${origin}/surprise/index.html?id=${data.id}`;
        
        setGeneratedLink(finalUrl);
        
        const newHistoryItem: WishHistoryItem = { 
          id: data.id, 
          name: cleanName, 
          date: new Date().toISOString().split('T')[0], 
          expiry,
          status: 'Active', 
          url: finalUrl,
          message: cleanMessage,
          timestamp: data.timestamp
        };

        const updatedHistory = [newHistoryItem, ...history];
        setHistory(updatedHistory);
        if (typeof window !== 'undefined') {
          localStorage.setItem('peach_wish_history', JSON.stringify(updatedHistory));
        }
        
        // Keep input fields populated in non-editable format as requested
      }
    } catch (error) {
      console.error('Error generating secure wish:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateNewWish = () => {
    setGeneratedLink('');
    setName('');
    setMessage('');
    setExpiry('3h');
    setIncludeAlbum(false);
    setAlbumMoments([
      { imageUrl: '', caption: '' },
      { imageUrl: '', caption: '' },
      { imageUrl: '', caption: '' },
      { imageUrl: '', caption: '' },
    ]);
  };

  const copyToClipboard = (text: string, id: string = 'main') => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      // Deleting a wish triggers a server-side deactivation so the recipient's link instantly expires
      await fetch('/api/wishes/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.error('Error executing delete wish API:', error);
    }

    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('peach_wish_history', JSON.stringify(updated));
    }
    setDeletingId(null);
  };

  const downloadQRCode = () => {
    const svg = document.getElementById('wish-qr-code');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = 440;
      canvas.height = 440;
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 440, 440);
        ctx.drawImage(img, 20, 20, 400, 400);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `peachwish-qr-${name || 'surprise'}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const shareQRCode = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        const svg = document.getElementById('wish-qr-code');
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          img.onload = async () => {
            canvas.width = 440;
            canvas.height = 440;
            if (ctx) {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, 440, 440);
              ctx.drawImage(img, 20, 20, 400, 400);
              canvas.toBlob(async (blob) => {
                if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'wish-qr.png', { type: 'image/png' })] })) {
                  const file = new File([blob], 'wish-qr.png', { type: 'image/png' });
                  await navigator.share({
                    title: `A Sweet Surprise from PeachWish`,
                    text: `Scan this QR code or open the link to view a special surprise: ${generatedLink}`,
                    files: [file],
                  });
                  return;
                }
                await navigator.share({
                  title: `A Sweet Surprise from PeachWish`,
                  text: `I made a sweet surprise wish for you! Tap to open:`,
                  url: generatedLink,
                });
              });
            }
          };
          img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
          return;
        }
        await navigator.share({
          title: `A Sweet Surprise from PeachWish`,
          text: `I made a sweet surprise wish for you! Tap to open:`,
          url: generatedLink,
        });
      } catch (err) {
        console.log('Share canceled or not allowed', err);
      }
    } else {
      copyToClipboard(generatedLink, 'main');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F6] font-sans text-[#3D302C] selection:bg-[#FFD4C6]/40 antialiased">
      
      {/* Upper Dashboard / Navigation */}
      <nav className="w-full bg-[#FFF0EA]/90 backdrop-blur-md border-b border-[#F5E1DA] sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-[#FFE4D9] text-[#E06D53]">
              <Heart className="w-5 h-5 fill-current text-[#FF7A59]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-wide text-lg text-[#3D302C]">PeachWish</span>
              <span className="text-[10px] text-[#A08882] tracking-wider uppercase font-medium -mt-1">Delivering Joy</span>
            </div>
          </div>
          
          <button 
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center gap-2 text-sm font-semibold text-[#8C716B] hover:text-[#E06D53] transition-all bg-[#FFFDFD] hover:bg-[#FFF5F1] px-4 py-2.5 rounded-2xl border border-[#EAD5CE] hover:border-[#FFBCA7] shadow-sm"
          >
            <History className="w-4 h-4 text-[#FF8A71]" />
            <span>My Wishes</span>
            {history.length > 0 && (
              <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-[#FFE4D9] text-[#E06D53] font-bold">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      <AdBanner />

      <main className="py-12 px-4 sm:px-6 max-w-2xl mx-auto space-y-10">
        
        {/* Header - Warm, Loving & Universal for Everyone */}
        <header className="text-center space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#3D302C]">
            Share <span className="text-[#FF8A71]">Sweet Surprises</span>
          </h1>
          <p className="text-base text-[#6E5D59] max-w-xl mx-auto leading-relaxed">
            Craft a personalized, heartwarming wish page for your favorite person, partner, friend, or family. Send your pure feelings through a lovely link and heart QR code.
          </p>
        </header>

        {/* Main Creation Card */}
        <div className="bg-white rounded-3xl border border-[#F5E1DA] p-6 sm:p-8 shadow-xl shadow-[#F0DCD4]/20">
          <form onSubmit={handleGenerate} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Recipient Name Input */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-bold text-[#5C4B47] flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-[#FF8A71]" />
                  Who is this special wish for?
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 97"
                  required
                  disabled={isGenerating || !!generatedLink}
                  className="w-full px-4 py-3 rounded-xl border border-[#EAD5CE] bg-[#FFFDFD] text-[#3D302C] placeholder:text-[#A89691] focus:border-[#FF8A71] focus:ring-1 focus:ring-[#FF8A71] transition-all outline-none disabled:bg-[#FFF5F1]/60 disabled:text-[#8C716B] disabled:border-[#F5E1DA] disabled:cursor-not-allowed"
                />
              </div>

              {/* Expiry Input */}
              <div className="space-y-2">
                <label htmlFor="expiry" className="block text-sm font-bold text-[#5C4B47] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#FF8A71]" />
                  Keep it visible for
                </label>
                <div className="relative">
                  <select
                    id="expiry"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    disabled={isGenerating || !!generatedLink}
                    className="w-full px-4 py-3 rounded-xl border border-[#EAD5CE] bg-[#FFFDFD] text-[#3D302C] focus:border-[#FF8A71] focus:ring-1 focus:ring-[#FF8A71] transition-all outline-none appearance-none cursor-pointer pr-10 disabled:bg-[#FFF5F1]/60 disabled:text-[#8C716B] disabled:border-[#F5E1DA] disabled:cursor-not-allowed"
                  >
                    <option value="1h">1 Hour (Quick Surprise)</option>
                    <option value="3h">3 Hours (Sweet Moment)</option>
                    <option value="6h">6 Hours (Special Wish)</option>
                    <option value="12h">12 Hours (Half-Day Joy)</option>
                    <option value="24h">24 Hours (Full Special Day)</option>
                  </select>
                  <Clock className="w-4 h-4 text-[#A89691] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-bold text-[#5C4B47] flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-[#FF8A71]" />
                Your Sweet, Heartfelt Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Write your loving wishes, beautiful memories, or sweet words to make them smile..."
                required
                disabled={isGenerating || !!generatedLink}
                className="w-full px-4 py-3 rounded-xl border border-[#EAD5CE] bg-[#FFFDFD] text-[#3D302C] placeholder:text-[#A89691] focus:border-[#FF8A71] focus:ring-1 focus:ring-[#FF8A71] transition-all outline-none resize-none disabled:bg-[#FFF5F1]/60 disabled:text-[#8C716B] disabled:border-[#F5E1DA] disabled:cursor-not-allowed"
              />
            </div>

            {/* Memory Album Toggle and Builder */}
            <div className="space-y-4 pt-4 border-t border-[#FFF0EA]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#FF8A71]" />
                  <span className="font-bold text-base text-[#3D302C] capitalize">album</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={includeAlbum}
                    onChange={(e) => setIncludeAlbum(e.target.checked)}
                    disabled={isGenerating || !!generatedLink}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF8A71]"></div>
                  <span className="ml-2 text-xs font-bold text-[#8C716B]">Enabled</span>
                </label>
              </div>

              {includeAlbum && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <p className="text-xs font-bold text-[#8C716B]">
                    under 2MB each
                  </p>
                  
                  {albumMoments.some(m => m.imageUrl) && (
                    <AdBanner />
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {albumMoments.map((moment, index) => (
                      <div key={index} className="p-4 rounded-2xl bg-[#FFF9F6] border border-[#EAD5CE] space-y-3 shadow-inner">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#E06D53] tracking-wide uppercase">Moment {index + 1}</span>
                          
                          {/* File Uploader */}
                          {!generatedLink && (
                            <label className="flex items-center gap-1 text-[11px] font-bold text-[#FF8A71] hover:text-[#FF7A59] cursor-pointer transition-colors bg-white hover:bg-[#FFF0EA] px-2.5 py-1 rounded-lg border border-[#EAD5CE] shadow-sm">
                              <Upload className="w-3 h-3" />
                              <span>Upload</span>
                              <input 
                                type="file" 
                                accept="image/*"
                                className="hidden"
                                disabled={isGenerating || !!generatedLink}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 2 * 1024 * 1024) {
                                      alert("Please select a smaller image under 2MB!");
                                      return;
                                    }
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      const updated = [...albumMoments];
                                      updated[index].imageUrl = reader.result as string;
                                      setAlbumMoments(updated);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>

                        {/* Image Preview Slot */}
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-[#FFF5F1] border border-[#FAD2C4] flex items-center justify-center group shadow-sm">
                          {moment.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                              src={moment.imageUrl} 
                              alt={`Moment ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center text-[#A89691] gap-1.5 p-4 text-center">
                              <Camera className="w-6 h-6 text-[#FF8A71]/60" />
                              <span className="text-[10px] font-semibold text-[#8C716B]">No Photo Uploaded</span>
                              <span className="text-[9px] text-[#A89691]">Tap &quot;Upload&quot; to add a memory</span>
                            </div>
                          )}
                        </div>

                        {/* Caption input */}
                        <div className="space-y-1">
                          <input 
                            type="text"
                            value={moment.caption}
                            onChange={(e) => {
                              const updated = [...albumMoments];
                              updated[index].caption = e.target.value;
                              setAlbumMoments(updated);
                            }}
                            disabled={isGenerating || !!generatedLink}
                            placeholder={`Describe Moment ${index + 1}...`}
                            maxLength={100}
                            required
                            className="w-full px-3 py-2 rounded-lg text-xs border border-[#EAD5CE] bg-white text-[#3D302C] focus:border-[#FF8A71] focus:ring-1 focus:ring-[#FF8A71] transition-all outline-none disabled:bg-[#FFF5F1]/60 disabled:text-[#8C716B] disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isGenerating || !!generatedLink || (!name.trim() || !message.trim())}
              className="w-full flex items-center justify-between group bg-[#FF8A71] hover:bg-[#FF7A59] text-white px-6 py-4 rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#FF8A71]/25"
            >
              <span className="flex items-center gap-2.5">
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 fill-current" />}
                {isGenerating ? 'Weaving Your Sweet Wish...' : (!!generatedLink ? 'Surprise Successfully Weaved' : 'Create Sweet Surprise')}
              </span>
              {!isGenerating && !generatedLink && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>

        {/* Success & Direct Sharing Banner */}
        {generatedLink && (
          <div className="bg-[#FFFDFD] border-2 border-[#FFD4C6] rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 shadow-2xl shadow-[#FF8A71]/5">
            
            <div className="text-center space-y-1">
              <div className="inline-flex items-center justify-center p-3.5 rounded-full bg-[#FFE4D9] text-[#FF7A59] mb-2">
                <Heart className="w-7 h-7 fill-current" />
              </div>
              <h3 className="text-2xl font-black text-[#3D302C]">Surprise Link Created!</h3>
              <p className="text-sm text-[#6E5D59]">Copy the special link or share the custom Peach Heart QR code.</p>
            </div>

            <AdBanner />

            {/* Link Copy Box */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#FFF5F1] p-2.5 rounded-2xl border border-[#FAD2C4]">
              <div className="flex-1 w-full truncate px-3 py-1 text-sm font-semibold font-mono text-[#E06D53]">
                {generatedLink}
              </div>
              <button
                onClick={() => copyToClipboard(generatedLink, 'main')}
                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-[#FF8A71] hover:bg-[#FF7A59] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm shadow-[#FF8A71]/20"
              >
                {copiedId === 'main' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </button>
            </div>

            {/* Heart-Shaped Red QR Code & Direct Share Section */}
            <div className="pt-5 border-t border-[#F5E1DA] flex flex-col items-center gap-5">
              <div className="p-4 bg-white rounded-3xl shadow-xl shadow-[#FF8A71]/10 border border-[#FAD2C4] flex items-center justify-center">
                <QRCodeSVG
                  id="wish-qr-code"
                  value={generatedLink}
                  size={190}
                  fgColor="#FF7A59"
                  bgColor="#FFFFFF"
                  level="H"
                  imageSettings={{
                    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF7A59" stroke="%23FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
                    x: undefined,
                    y: undefined,
                    height: 48,
                    width: 48,
                    excavate: true,
                  }}
                />
              </div>

              {/* Direct Share & Download Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 w-full pt-1">
                <button
                  onClick={shareQRCode}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#FF7A59] hover:bg-[#E06D53] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-[#FF7A59]/20"
                >
                  <Share2 className="w-4 h-4" />
                  Share QR Code
                </button>
                <button
                  onClick={downloadQRCode}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white hover:bg-[#FFF5F1] text-[#E06D53] px-6 py-3 rounded-xl font-bold text-sm border-2 border-[#FAD2C4] transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download QR Image
                </button>
              </div>
              <p className="text-xs text-[#8C716B] text-center max-w-md">
                You can send this QR code image on WhatsApp, Snapchat, Instagram, or anywhere. When they scan it, your beautiful wish card will be revealed!
              </p>
            </div>

          </div>
        )}

        {/* Generate New Wish Back Option Outside of the box with confirmation */}
        {generatedLink && (
          <div className="flex flex-col items-center gap-3 pt-4 pb-8 animate-in fade-in duration-300">
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-2 text-[#E06D53] hover:text-[#FF7A59] font-bold text-base transition-all px-6 py-3 rounded-xl bg-white/40 hover:bg-[#FFF0EA] border border-[#EAD5CE] shadow-sm hover:scale-[1.02]"
              >
                <ArrowLeft className="w-5 h-5" />
                Generate New Wish
              </button>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-3 bg-white/80 border border-[#EAD5CE] px-5 py-3 rounded-2xl shadow-sm animate-in zoom-in-95 duration-200 text-center">
                <span className="text-sm font-semibold text-[#8C716B]">Clear current wish and start over?</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleCreateNewWish();
                      setShowResetConfirm(false);
                    }}
                    className="bg-[#E06D53] hover:bg-[#FF7A59] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm"
                  >
                    Yes, Start Over
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="bg-white hover:bg-[#FFF5F1] text-[#8C716B] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#EAD5CE] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <AdBanner />

      {/* Signature Footer */}
      <footer className="w-full pb-8 pt-4 flex justify-center animate-in fade-in duration-500">
        <p className="text-xs text-[#8C716B]">
          Developed by{' '}
          <a 
            href="https://www.linkedin.com/in/rehan-ahmad-863386382" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#E06D53] hover:text-[#FF7A59] font-extrabold font-sans transition-all hover:underline"
          >
            Rehan97
          </a>
        </p>
      </footer>

      {/* History Modal Overlay - Triggered from upper dashboard button */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D211E]/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-[#EAD5CE] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[#F5E1DA] flex items-center justify-between bg-[#FFF0EA]/40">
              <div className="flex items-center gap-2 text-[#3D302C]">
                <History className="w-5 h-5 text-[#FF8A71]" />
                <h3 className="text-lg font-bold">Surprise Wish History</h3>
              </div>
              <button 
                onClick={() => {
                  setShowHistoryModal(false);
                  setDeletingId(null);
                }}
                className="p-1.5 rounded-xl text-[#8C716B] hover:text-[#3D302C] hover:bg-[#FFF0EA]/80 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-3 overflow-y-auto flex-1 custom-scrollbar bg-[#FFFDFD]">
              {history.length === 0 ? (
                <div className="py-12 text-center text-[#8C716B] space-y-2">
                  <Heart className="w-8 h-8 text-[#FFD4C6] mx-auto" />
                  <p className="text-sm font-medium">No wishes created yet</p>
                  <p className="text-xs text-[#A89691]">Your beautiful moments will appear here once generated</p>
                </div>
              ) : (
                history.map((item) => {
                  const expired = isExpired(item.expiry, item.timestamp);
                  const isConfirmingDelete = deletingId === item.id;

                  return (
                    <div 
                      key={item.id} 
                      className={cn(
                        "p-4 rounded-2xl bg-white border transition-all flex flex-col gap-3 shadow-sm",
                        expired ? "border-[#F5E1DA] opacity-75" : "border-[#F5E1DA] hover:border-[#FFBCA7]"
                      )}
                    >
                       <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-[#3D302C] text-base">To: {item.name}</h4>
                          <div className="flex flex-col gap-1 mt-1">
                            <p className="text-xs text-[#8C716B]">Created: {item.date}</p>
                            <p className={cn(
                              "text-xs font-semibold flex items-center gap-1",
                              expired ? "text-[#A89691]" : "text-[#FF8A71]"
                            )}>
                              <Clock className="w-3.5 h-3.5" />
                              {expired ? "Expired" : `Expires in: ${getExpiryCountdown(item.expiry, item.timestamp)}`}
                            </p>
                          </div>
                        </div>
                        <span className={cn(
                          "px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg",
                          expired 
                            ? "bg-[#FFF5F1] text-[#A89691] border border-[#EAD5CE]" 
                            : "bg-[#FFE4D9] text-[#E06D53] border border-[#FFD4C6]"
                        )}>
                          {expired ? 'Expired' : 'Active'}
                        </span>
                      </div>

                      <p className="text-xs text-[#6E5D59] line-clamp-2 bg-[#FFFDFD] p-2.5 rounded-xl border border-[#F5E1DA] italic">
                        &ldquo;{item.message}&rdquo;
                      </p>
                      
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F5E1DA]">
                        {!isConfirmingDelete ? (
                          <>
                            <span className="flex-1 text-xs font-mono text-[#8C716B] truncate">
                              {item.url}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button 
                                onClick={() => copyToClipboard(item.url, item.id)} 
                                className={cn(
                                  "px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1",
                                  copiedId === item.id 
                                    ? "bg-[#FFE4D9] text-[#E06D53]" 
                                    : "bg-[#FFF5F1] text-[#8C716B] hover:text-[#E06D53] hover:bg-[#FFE4D9] border border-[#EAD5CE]"
                                )}
                                title="Copy Link"
                              >
                                {copiedId === item.id ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                              
                              <button
                                onClick={() => setDeletingId(item.id)}
                                className="p-1.5 rounded-xl text-[#A89691] hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                                title="Delete Wish"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        ) : (
                          /* Custom Confirmation State inside modal */
                          <div className="flex items-center justify-between w-full bg-red-50 border border-red-100 p-2.5 rounded-xl animate-in fade-in slide-in-from-right-3">
                            <div className="flex items-center gap-1.5 text-red-600 text-xs font-semibold">
                              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                              <span>Are you sure you want to delete this wish?</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-all shadow-sm"
                              >
                                Yes, Delete
                              </button>
                              <button
                                onClick={() => setDeletingId(null)}
                                className="bg-white hover:bg-gray-100 text-[#6E5D59] text-[11px] font-bold px-3 py-1 rounded-lg border border-[#EAD5CE] transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#F5E1DA] bg-[#FFF0EA]/40 flex justify-end">
              <button
                onClick={() => {
                  setShowHistoryModal(false);
                  setDeletingId(null);
                }}
                className="px-5 py-2 rounded-xl text-sm font-bold bg-white hover:bg-[#FFF5F1] text-[#8C716B] border border-[#EAD5CE] hover:border-[#FFBCA7] transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
