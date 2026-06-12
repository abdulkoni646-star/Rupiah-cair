import React, { useState } from 'react';
import { WithdrawalDetails, LoanDetails } from '../types';
import { Sparkles, ArrowDownIcon, ShieldCheck, Wallet, ArrowUpRight, HelpCircle, History, Info } from 'lucide-react';

interface DashboardCairkanProps {
  loan: LoanDetails;
  initialFullName: string;
  registrationBonus: number;
  onCairkan: (details: WithdrawalDetails) => void;
}

export default function DashboardCairkan({
  loan,
  initialFullName,
  registrationBonus,
  onCairkan,
}: DashboardCairkanProps) {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState(initialFullName || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleUseMyName = () => {
    setAccountHolder(initialFullName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!bankName) {
      newErrors.bankName = 'Pilih Bank tujuan pencairan.';
    }
    if (!/^\d{5,18}$/.test(accountNumber.replace(/\s/g, ''))) {
      newErrors.accountNumber = 'Nomor rekening harus berupa 5 sampai 18 digit angka.';
    }
    if (accountHolder.trim().length < 3) {
      newErrors.accountHolder = 'Ketik Nama lengkap pemilik rekening yang sah.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onCairkan({
      bankName,
      accountNumber: accountNumber.replace(/\s/g, ''),
      accountHolder,
    });
  };

  const indonesianBanks = [
    { code: 'BCA', name: 'Bank Central Asia (BCA)' },
    { code: 'MANDIRI', name: 'Bank Mandiri' },
    { code: 'BRI', name: 'Bank Rakyat Indonesia (BRI)' },
    { code: 'BNI', name: 'Bank Negara Indonesia (BNI)' },
    { code: 'KROM', name: 'Krom Bank Indonesia' },
    { code: 'CIMB', name: 'CIMB Niaga' },
    { code: 'DANAMON', name: 'Bank Danamon' },
    { code: 'PERMATA', name: 'Permata Bank' },
    { code: 'JAGO', name: 'Bank Jago' },
    { code: 'NEO', name: 'Neo Bank Commerce' },
    { code: 'ALLO', name: 'Allo Bank' },
  ];

  return (
    <div id="dashboard-withdraw-step" className="max-w-2xl mx-auto space-y-6">
      {/* Pop-up Celebration Banner for registration success & Rp80,000 bonus */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-5 rounded-3xl shadow-lg border border-emerald-400 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-y-3 translate-x-3 opacity-20 pointer-events-none">
          <Sparkles size={110} />
        </div>
        <div className="flex gap-4 items-start">
          <div className="h-10 w-10 shrink-0 rounded-full bg-white/20 flex items-center justify-center text-white text-base">
            ✨
          </div>
          <div className="space-y-1">
            <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold text-emerald-950 bg-emerald-100 rounded-full">
              BONUS REGISTRASI CAIR
            </span>
            <h3 className="text-lg font-bold">Registrasi Berhasil! Bonus Rp 80.000 Aktif</h3>
            <p className="text-xs text-emerald-50 leading-relaxed font-sans">
              Selamat, verifikasi dokumen Anda sukses. Bonus saldo sebesar <strong className="font-semibold text-emerald-100">{formatRupiah(registrationBonus)}</strong> telah masuk otomatis dan siap ditarik bersama limit kredit Anda!
            </p>
          </div>
        </div>
      </div>

      {/* Credit and Wallet Status Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

        <div className="flex justify-between items-center mb-6 relative">
          <div className="flex items-center gap-2">
            <Wallet className="text-emerald-400" size={20} />
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Dompet Rupiah Cair</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck size={12} /> Saldo Verifikasi Aman
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Main limit approved */}
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-medium">Batas Limit Pinjaman Disetujui</p>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white">
              {formatRupiah(loan.amount)}
            </p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
              <span>Bunga Flat Bersahabat</span> • <span>Tenor {loan.tenor} Bulan</span>
            </p>
          </div>

          {/* Bonus balance & total */}
          <div className="space-y-1 md:border-l md:border-slate-800 md:pl-6">
            <p className="text-xs text-slate-400 font-medium">Bonus Pendaftaran Aktif</p>
            <p className="text-2xl font-bold font-mono text-emerald-400">
              + {formatRupiah(registrationBonus)}
            </p>
            <p className="text-xs text-slate-400 pt-1.5 flex justify-between">
              <span>Total Dana Maksimal Ditarik:</span>
              <strong className="text-white font-bold">{formatRupiah(loan.amount + registrationBonus)}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Main Withdrawal form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100">
        <div className="pb-5 mb-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Formulir Cairkan Dana</h2>
            <p className="text-xs text-gray-400 mt-1">Isi nomor rekening bank Anda dengan teliti agar dana diproses instan.</p>
          </div>
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
            <ArrowDownIcon size={20} className="animate-bounce" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Bank Destination Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Pilih Bank Tujuan Penerima
            </label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl font-sans text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                errors.bankName ? 'border-red-400 bg-red-50/10' : 'border-gray-200'
              }`}
            >
              <option value="">-- Pilih Bank --</option>
              {indonesianBanks.map((b) => (
                <option key={b.code} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
            {errors.bankName && (
              <p className="text-red-500 text-xs mt-1.5">{errors.bankName}</p>
            )}
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nomor Rekening Bank Penerima
            </label>
            <input
              type="text"
              pattern="\d*"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\s/g, '').replace(/\D/g, ''))}
              placeholder="Masukkan nomor rekening tanpa spasi/simbol"
              className={`w-full px-4 py-3 border rounded-xl font-sans text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                errors.accountNumber ? 'border-red-400 bg-red-50/10' : 'border-gray-200'
              }`}
            />
            {errors.accountNumber ? (
              <p className="text-red-500 text-xs mt-1.5">{errors.accountNumber}</p>
            ) : (
              <p className="text-gray-400 text-xs mt-1">Pastikan tidak salah memasukkan angka agar tidak terjadi kegagalan sistem transfer.</p>
            )}
          </div>

          {/* Account Holder's Name */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-semibold text-gray-700">
                Nama Lengkap Pemilik Rekening
              </label>
              {initialFullName && (
                <button
                  type="button"
                  onClick={handleUseMyName}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Gunakan Nama Saya
                </button>
              )}
            </div>
            <input
              type="text"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              placeholder="Contoh: BUDI SANTOSO"
              className={`w-full px-4 py-3 border rounded-xl font-sans text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                errors.accountHolder ? 'border-red-400 bg-red-50/10' : 'border-gray-200'
              }`}
            />
            {errors.accountHolder && (
              <p className="text-red-500 text-xs mt-1.5">{errors.accountHolder}</p>
            )}
            <p className="text-[11px] text-amber-600 font-medium mt-1.5 bg-amber-50 p-2.5 rounded-lg border border-amber-100 flex items-center gap-1.5">
              <Info size={14} className="shrink-0" />
              <span>Rekening bank <strong className="font-bold">HARUS atas nama pendaftar sendiri</strong> sesuai instruksi OJK. Nama penerima yang berbeda berpotensi memperlambat proses persetujuan berkas.</span>
            </p>
          </div>

          {/* Summary Withdrawal Preview */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs sm:text-xs text-slate-600 space-y-2 mt-4">
            <div className="flex justify-between">
              <span>Limit Pokok Pinjaman:</span>
              <strong className="text-slate-900">{formatRupiah(loan.amount)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Bonus Registrasi:</span>
              <strong className="text-emerald-600 font-semibold">+ {formatRupiah(registrationBonus)}</strong>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
              <span className="font-semibold text-slate-800">Total Pencairan Berkas:</span>
              <strong className="text-emerald-600 font-bold text-base">{formatRupiah(loan.amount + registrationBonus)}</strong>
            </div>
          </div>

          {/* Withdrawal Submit Buttons */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-4 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xl hover:shadow-emerald-200 inline-flex items-center justify-center gap-2 active:scale-[0.98] rounded-2xl"
            >
              CAIRKAN SEKARANG KE REKENING
              <ArrowUpRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
