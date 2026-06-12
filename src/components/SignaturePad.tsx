import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Trash2, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

interface SignaturePadProps {
  initialSignature: string;
  onSave: (signatureDataUrl: string) => void;
  onPrev: () => void;
}

export default function SignaturePad({ initialSignature, onSave, onPrev }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(!!initialSignature);
  const [typedName, setTypedName] = useState('');
  const [signType, setSignType] = useState<'draw' | 'type'>('draw');

  useEffect(() => {
    if (signType === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // High DPI canvas support
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        ctx.strokeStyle = '#059669'; // Emerald-600
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Pre-fill initial signature if available
        if (initialSignature && initialSignature.startsWith('data:image')) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, rect.width, rect.height);
          };
          img.src = initialSignature;
        }
      }
    }
  }, [signType, initialSignature]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSigned(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signType === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasSigned) return;
      const dataUrl = canvas.toDataURL();
      onSave(dataUrl);
    } else {
      if (!typedName.trim()) return;
      // Convert typed handwriting to a temporary canvas-generated standard sign with text
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 400;
      tempCanvas.height = 160;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        ctx.font = 'italic bold 28px "Georgia", serif';
        ctx.fillStyle = '#059669'; // Emerald-600
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedName, 200, 80);
        ctx.strokeStyle = '#34d399'; // Emerald-400 under-line accent
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(50, 110);
        ctx.lineTo(350, 110);
        ctx.stroke();
        onSave(tempCanvas.toDataURL());
      }
    }
  };

  return (
    <div id="signature-step" className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Step Progress Header */}
      <div className="bg-emerald-600 px-6 py-8 text-white relative">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Langkah 2 dari 3</span>
          <span className="bg-emerald-500/30 text-emerald-100 px-2 py-0.5 rounded-full text-xs font-medium">Formulir Digital</span>
        </div>
        <h2 className="text-2xl font-bold font-sans">Tanda Tangan Digital</h2>
        <p className="text-sm text-emerald-100 mt-1">Bubuhkan tanda tangan Anda sebagai keabsahan dokumen perjanjian pinjaman.</p>
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex gap-2 p-1 bg-gray-50 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setSignType('draw')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              signType === 'draw'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sapu Layar (Draw)
          </button>
          <button
            type="button"
            onClick={() => setSignType('type')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              signType === 'type'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Tulis Nama (Text)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {signType === 'draw' ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between items-center">
                <span>Gambar Tanda Tangan Anda di Kotak Berikut:</span>
                {hasSigned && (
                  <span className="text-xs text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 size={12} className="inline" /> Sudah Ditandatangani
                  </span>
                )}
              </label>

              <div className="relative border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 overflow-hidden h-44 sm:h-52 cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="absolute inset-0 w-full h-full"
                />
                {!hasSigned && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-400">
                    <PenTool size={32} className="stroke-1.5 mb-2 text-gray-300" />
                    <span className="text-xs sm:text-sm">Gunakan mouse atau jari Anda untuk tanda tangan</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={clearCanvas}
                  disabled={!hasSigned}
                  className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 transition-colors disabled:opacity-40"
                >
                  <Trash2 size={14} />
                  Bersihkan Canvas
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ketik Nama Lengkap Anda (Cursive Style):
              </label>
              <input
                type="text"
                required
                value={typedName}
                onChange={(e) => {
                  setTypedName(e.target.value);
                  setHasSigned(e.target.value.trim().length > 0);
                }}
                placeholder="Contoh: Budi Santoso"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-400 transition-all font-sans"
              />

              {typedName && (
                <div className="mt-4 p-4 border border-emerald-100 rounded-2xl bg-emerald-50 flex flex-col items-center justify-center">
                  <span className="text-xs text-emerald-600 font-medium mb-2">Pratinjau Tanda Tangan:</span>
                  <div className="text-3xl font-bold tracking-wide text-emerald-600 italic font-mono py-2 select-none border-b border-emerald-200 w-3/4 text-center">
                    {typedName}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-amber-50 rounded-2xl p-4 flex gap-3 text-amber-800 text-xs sm:text-sm leading-relaxed border border-amber-100">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Pernyataan Hukum:</span> Dengan menandatangani dokumen ini digital, Anda menyatakan bahwa data yang diisi benar dan setuju untuk melampirkan berkas pengajuan pinjaman Rupiah Cair.
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onPrev}
              className="flex-1 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-all active:scale-[0.98] border border-gray-200 rounded-2xl"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={!hasSigned}
              className="flex-[2] py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200 inline-flex items-center justify-center gap-1.5 active:scale-[0.98] rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Simpan & Lanjutkan
              <ChevronRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
