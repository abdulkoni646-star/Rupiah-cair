import React, { useState, useEffect } from 'react';
import { AppState } from '../types';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  ShieldCheck, 
  FileText, 
  Share2, 
  Printer, 
  User, 
  CreditCard,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface StatusPengajuanProps {
  state: AppState;
  onReset: () => void;
}

export default function StatusPengajuan({ state, onReset }: StatusPengajuanProps) {
  const [progressPercent, setProgressPercent] = useState(82);
  const [timeLeft, setTimeLeft] = useState(299); // 5 minutes in seconds countdown
  const [currentStatusNote, setCurrentStatusNote] = useState('Petugas Verifikasi Sedang Meninjau Berkas Kontrak Anda.');

  useEffect(() => {
    // Elegant countdown simulating active reviewer checking
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update notes periodically to simulate real actions
  useEffect(() => {
    const statusMessages = [
      'Menyamakan foto KTP dan NIK dengan data Dukcapil...',
      'Memverifikasi bukti transfer bea meterai Rp 20.000 ke KROM BANK...',
      'Mengecek tanda tangan digital legalitas pada lembar kesepakatan...',
      'Mengonfirmasi kesesuaian nama pemilik rekening penerima...',
      'Menghitung skor kredit pinjaman plus bonus registrasi Rp 80.000...',
      'Hampir selesai! Menghubungkan gateway pencairan dana otomatis...',
    ];

    const messageInterval = setInterval(() => {
      const randomMsg = statusMessages[Math.floor(Math.random() * statusMessages.length)];
      setCurrentStatusNote(randomMsg);
      // Slightly fluctuate progress representation between 80% and 95%
      setProgressPercent(Math.floor(Math.random() * 15) + 80);
    }, 8000);

    return () => clearInterval(messageInterval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="status-step" className="max-w-2xl mx-auto space-y-6">
      {/* Dynamic Animated Status Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-100 relative overflow-hidden">
        {/* Amber status glow */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500"></div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
              <Clock size={24} className="animate-spin duration-[4000ms]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-700 tracking-wider uppercase block bg-amber-50 px-2 py-0.5 rounded-full w-max border border-amber-200 mb-1">
                MENUNGGU PERSETUJUAN
              </span>
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight">Pengajuan Sedang Ditinjau</h2>
              <p className="text-xs text-gray-400 mt-1">Estimasi keputusan otomatis dalam waktu kurang dari 5 menit.</p>
            </div>
          </div>

          <div className="bg-slate-950 text-white px-4 py-2.5 rounded-2xl text-center self-stretch sm:self-auto flex sm:flex-col justify-between sm:justify-center items-center font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-sans sm:mb-0.5 block">Waktu Sisa</span>
            <span className="text-lg font-bold text-amber-400">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-500">Verifikasi Kelayakan Berkas Kontrak</span>
            <span className="text-amber-600 font-bold">{progressPercent}% selesai</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div 
              style={{ width: `${progressPercent}%` }} 
              className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full rounded-full transition-all duration-1000"
            ></div>
          </div>
          <p className="text-[11px] text-slate-500 italic flex items-center gap-1.5 pt-1.5">
            <RefreshCw size={11} className="animate-spin text-amber-500" />
            <span>Aktifitas audit: <strong className="font-medium text-slate-700">{currentStatusNote}</strong></span>
          </p>
        </div>
      </div>

      {/* Main Digital Ticket Receipt */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Ticket Header Graphic */}
        <div className="bg-slate-900 text-white px-6 py-5 flex justify-between items-center border-b border-slate-800">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">ID TRANSAKSI:</span>
            <span className="text-sm font-bold font-mono tracking-widest text-emerald-400">{state.transactionId}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase block">Tanggal Pengajuan:</span>
            <span className="text-xs font-medium font-sans">{new Date(state.appliedAt).toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Receipt content sections */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Col - Applicant Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
                <User size={13} /> Profil Pemohon
              </h3>
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 text-[11px] block">Nama Lengkap Sesuai KTP</span>
                  <span className="font-semibold text-slate-800 uppercase">{state.form.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">NIK KTP Resmi</span>
                  <span className="font-mono text-slate-800">{state.form.nik}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">No. HP / Whatsapp Terkait</span>
                  <span className="font-medium text-slate-800">{state.form.phone}</span>
                </div>
              </div>
            </div>

            {/* Right Col - Disbursement Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
                <CreditCard size={13} /> Rekening Tujuan Pencairan
              </h3>
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 text-[11px] block">Bank Tujuan</span>
                  <span className="font-semibold text-slate-800">{state.withdrawal.bankName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Nomor Rekening Penerima</span>
                  <span className="font-mono font-bold text-slate-900 tracking-wide">{state.withdrawal.accountNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Atas Nama Pemilik Rekening</span>
                  <span className="font-semibold text-slate-800 uppercase">{state.withdrawal.accountHolder}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Breakdown Ribbon */}
          <div className="bg-slate-50 border border-slate-100 p-4 sm:p-5 rounded-2xl mt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Rincian Nominal Dana Cair</h4>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Pinjaman Pokok Disetujui:</span>
                <span className="font-semibold text-slate-900">{formatRupiah(state.loan.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  Bonus Registrasi Awal:
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded-full font-bold">CAIR</span>
                </span>
                <span className="font-semibold text-emerald-600">+ {formatRupiah(state.registrationBonus)}</span>
              </div>
              <div className="flex justify-between pt-2.5 border-t border-slate-200 text-sm">
                <span className="font-bold text-slate-800">Total Dana Pengiriman Transfer:</span>
                <span className="font-extrabold text-emerald-600 text-base">{formatRupiah(state.loan.amount + state.registrationBonus)}</span>
              </div>
            </div>
          </div>

          {/* Proof verification indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Meterai verify Status */}
            <div className="border border-emerald-100 bg-emerald-50/40 rounded-2xl p-4 flex gap-3 items-start">
              <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={18} />
              <div className="space-y-1">
                <strong className="text-xs text-emerald-950 font-bold block">BEA METERAI VERIFIED</strong>
                <p className="text-[10px] text-emerald-800/80 leading-normal">
                  Penyetoran bea meterai Rp 20.000 ke rekening BERSAMA KROM BANK (770041229905) berhasil dikonfirmasi dan dilekatkan pada dokumen perjanjian.
                </p>
              </div>
            </div>

            {/* Signature verified status */}
            <div className="border border-emerald-100 bg-emerald-50/40 rounded-2xl p-4 flex gap-3 items-start">
              <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={18} />
              <div className="space-y-1">
                <strong className="text-xs text-emerald-950 font-bold block">TANDA TANGAN VERIFIED</strong>
                <p className="text-[10px] text-emerald-800/80 leading-normal">
                  Keabsahan tanda tangan pengaju dengan lembar verifikasi kecocokan data resmi dinyatakan absah dan mengikat secara hukum digital.
                </p>
              </div>
            </div>
          </div>

          {/* Document visual indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Signature Image preview */}
            {state.signatureData && (
              <div className="border border-slate-100 p-3 rounded-2xl bg-slate-50 flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 font-semibold mb-2 uppercase">Dokumen Tanda Tangan</span>
                <div className="h-16 outline outline-1 outline-slate-200 rounded-lg overflow-hidden bg-white px-4 flex items-center justify-center">
                  <img
                    src={state.signatureData}
                    alt="Digital Signature"
                    className="h-12 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}

            {/* Slip Meterai Upload preview */}
            {state.receiptImage && (
              <div className="border border-slate-100 p-3 rounded-2xl bg-slate-50 flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 font-semibold mb-2 uppercase font-sans">Bukti Slip Meterai (KROM BANK)</span>
                <div className="h-16 outline outline-1 outline-slate-200 rounded-lg overflow-hidden bg-white flex items-center justify-center w-full max-w-[150px]">
                  <img
                    src={state.receiptImage}
                    alt="Receipt Slip"
                    className="h-14 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions for printing */}
        <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-between items-center border-t border-slate-100 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck size={14} className="text-emerald-600" />
            Diuji & dijamin legalitas dokumen Rupiah Cair
          </span>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4  py-2 border border-gray-200 hover:bg-white text-gray-700 font-semibold rounded-xl tracking-wide transition-colors"
            >
              <Printer size={14} /> Cetak Bukti
            </button>
            <button
              onClick={onReset}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-white bg-slate-900 hover:bg-slate-800 font-semibold rounded-xl text-center cursor-pointer transition-colors"
            >
              Mulai Ulang Simulasi
            </button>
          </div>
        </div>
      </div>

      {/* Safety Help Info Section */}
      <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 flex gap-4 text-blue-950 text-xs sm:text-sm">
        <Info size={24} className="text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold text-sm text-blue-950">Tahap Terakhir Sedang Berjalan</strong>
          <p className="text-blue-900/90 leading-relaxed font-sans">
            Dana pinjaman beserta bonus pendaftaran Anda sebesar <strong className="font-semibold">{formatRupiah(state.loan.amount + state.registrationBonus)}</strong> saat ini berada di antrian aman transfer sistem RTGS/LLG. Mohon jaga keaktifan Whatsapp Anda. Petugas layanan mungkin akan menghubungi untuk verifikasi suara lanjutan secara berkala.
          </p>
        </div>
      </div>
    </div>
  );
}
