import React, { useState, useRef } from 'react';
import { CreditCard, Copy, Check, Upload, Sparkles, Receipt, ArrowRight, AlertTriangle, FileText } from 'lucide-react';

interface PembayaranMeteraiProps {
  onConfirm: (receiptImage: string) => void;
  onPrev: () => void;
}

export default function PembayaranMeterai({ onConfirm, onPrev }: PembayaranMeteraiProps) {
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedAmt, setCopiedAmt] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bankAccount = '770041229905';
  const amount = '20000';

  const copyToClipboard = (text: string, type: 'bank' | 'amount') => {
    navigator.clipboard.writeText(text);
    if (type === 'bank') {
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    } else {
      setCopiedAmt(true);
      setTimeout(() => setCopiedAmt(false), 2000);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setUploadProgress(true);
    // Convert to Base64 read with reader
    const reader = new FileReader();
    reader.onload = () => {
      setTimeout(() => {
        setReceiptUrl(reader.result as string);
        setUploadProgress(false);
      }, 1000); // 1-second delay for premium loader experience
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Helper to generate custom simulated receipt preview
  const handleSimulatePayment = () => {
    setUploadProgress(true);
    setTimeout(() => {
      // Create a nice fake receipt representation image in canvas
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f8fafc'; // light gray back
        ctx.fillRect(0, 0, 300, 400);

        ctx.fillStyle = '#eaebec';
        ctx.fillRect(15, 15, 270, 370);

        // Header receipt ticket
        ctx.fillStyle = '#059669'; // Emerald primary
        ctx.fillRect(15, 15, 270, 60);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('BUKTI TRANSFER BERHASIL', 150, 40);
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText('KROM BANK INTERBANK TRANSFER', 150, 58);

        // Core details
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'left';
        ctx.font = 'bold 12px "Courier New", monospace';
        ctx.fillText('PENGIRIM: M-BANKING USER', 30, 110);
        ctx.fillText('BANK TUJUAN: KROM BANK', 30, 140);
        ctx.fillText('NO REK: ' + bankAccount, 30, 170);
        ctx.fillText('NAMA: METERAI RUPIAH CAIR', 30, 200);

        ctx.strokeStyle = '#cbd5e1';
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        ctx.moveTo(30, 230);
        ctx.lineTo(270, 230);
        ctx.stroke();

        ctx.fillStyle = '#059669';
        ctx.font = 'bold 18px "Courier New", monospace';
        ctx.fillText('NOMINAL: RP 20.000', 30, 270);

        ctx.fillStyle = '#64748b';
        ctx.font = '8px "Inter", sans-serif';
        ctx.fillText('No. Referensi: RC-' + Math.floor(Math.random() * 900000 + 100000), 30, 310);
        ctx.fillText('Tanggal: ' + new Date().toLocaleString('id-ID'), 30, 330);
        ctx.fillText('STATUS: SUKSES / TERVEIFIKASI', 30, 350);

        setReceiptUrl(canvas.toDataURL());
        setUploadProgress(false);
      }
    }, 800);
  };

  const handleNext = () => {
    if (receiptUrl) {
      onConfirm(receiptUrl);
    }
  };

  return (
    <div id="payment-step" className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header Info */}
      <div className="bg-emerald-600 px-6 py-8 text-white relative">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Langkah 3 dari 3</span>
          <span className="bg-emerald-500/30 text-emerald-100 px-2 py-0.5 rounded-full text-xs font-medium">Bea Meterai Legalitas</span>
        </div>
        <h2 className="text-2xl font-bold font-sans">Aktivasi Bea Meterai</h2>
        <p className="text-sm text-emerald-100 mt-1">
          Sesuai ketentuan undang-undang hukum perdata perihal pemeteraian dokumen perjanjian kredit online senilai Rp 20.000.
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Bank Card Info */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Rekening Aktivasi Resmi</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Pengecekan Otomatis
            </span>
          </div>

          <div className="py-4 space-y-4">
            {/* Bank Name */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 block font-normal">Nama Bank</span>
                <span className="text-base font-bold text-slate-800 font-sans">KROM BANK (KROM)</span>
              </div>
              <CreditCard size={24} className="text-emerald-600" />
            </div>

            {/* Account Number */}
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs text-slate-400 block font-normal">Nomor Rekening Tujuan</span>
                <span className="text-lg font-mono font-bold text-slate-900 tracking-wide">{bankAccount}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(bankAccount, 'bank')}
                className="p-1 px-2.5 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors inline-flex items-center gap-1"
              >
                {copiedBank ? <Check size={12} /> : <Copy size={12} />}
                {copiedBank ? 'Tersalin' : 'Salin No'}
              </button>
            </div>

            {/* Account Holder */}
            <div>
              <span className="text-xs text-slate-400 block font-normal">Penerima / Atas Nama</span>
              <span className="text-sm font-semibold text-slate-800">Meterai Rupiah Cair</span>
            </div>

            {/* Total Amount */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block font-normal">Biaya Bea Meterai Dokumen</span>
                <span className="text-xl font-bold text-emerald-600">Rp 20.000</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(amount, 'amount')}
                className="p-1 px-2.5 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors inline-flex items-center gap-1"
              >
                {copiedAmt ? <Check size={12} /> : <Copy size={12} />}
                {copiedAmt ? 'Tersalin' : 'Salin Nominal'}
              </button>
            </div>
          </div>
        </div>

        {/* Warning Callout */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800 text-xs sm:text-sm">
          <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block text-sm">Penting Sebelum Transfer</span>
            <p>Pastikan nominal yang dikirim pas senilai <strong className="font-bold underline text-amber-950">Rp 20.000</strong> ke rekening KROM BANK di atas agar terverifikasi otomatis oleh sistem AI dalam waktu kurang dari 1 menit.</p>
          </div>
        </div>

        {/* File Upload Area */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Unggah Bukti Pembayaran / Transfer
          </label>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-2xl p-6 transition-all text-center flex flex-col items-center justify-center cursor-pointer min-h-[140px]
              ${dragActive 
                ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]' 
                : receiptUrl 
                  ? 'border-emerald-200 bg-emerald-50/10' 
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100/50'
              }
            `}
            onClick={onButtonClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />

            {uploadProgress ? (
              <div className="space-y-2">
                <span className="h-6 w-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin inline-block"></span>
                <p className="text-xs text-gray-500 font-medium">Mengunggah & menganalisis bukti pembayaran...</p>
              </div>
            ) : receiptUrl ? (
              <div className="space-y-3 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Receipt size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-800">Bukti Transfer Berhasil Diproses!</p>
                  <p className="text-[10px] text-gray-400">Klik lagi jika ingin mengganti file</p>
                </div>
                <div className="max-h-24 overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                  <img
                    src={receiptUrl}
                    alt="Receipt preview"
                    className="h-20 object-contain mx-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="mx-auto h-10 w-10 text-gray-400 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center">
                  <Upload size={18} />
                </div>
                <div className="text-xs sm:text-sm">
                  <span className="font-semibold text-emerald-600">Klik untuk unggah</span> atau drag & drop di sini
                </div>
                <p className="text-[11px] text-gray-400 font-normal">Format file yang didukung: PNG, JPG, JPEG maks 5MB</p>
              </div>
            )}
          </div>

          {!receiptUrl && !uploadProgress && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleSimulatePayment}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-all bg-emerald-50 px-3 py-1.5 rounded-full"
              >
                <Sparkles size={12} />
                Gunakan Simulasi Bukti instan (Instantly generate receipt)
              </button>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onPrev}
            className="flex-1 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-all active:scale-[0.98] border border-gray-200 rounded-2xl"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!receiptUrl || uploadProgress}
            className="flex-[2] py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200 inline-flex items-center justify-center gap-1.5 active:scale-[0.98] rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Kirim Pengajuan
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
