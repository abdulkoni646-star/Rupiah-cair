import React, { useState } from 'react';
import { UserForm, LoanDetails } from '../types';
import { FileText, Shield, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';

interface FormulirLengkapProps {
  initialForm: UserForm;
  loan: LoanDetails;
  onSave: (form: UserForm) => void;
  onPrev: () => void;
}

export default function FormulirLengkap({ initialForm, loan, onSave, onPrev }: FormulirLengkapProps) {
  const [form, setForm] = useState<UserForm>({ ...initialForm });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    // NIK validation (16 digits in Indonesia)
    if (!/^\d{16}$/.test(form.nik)) {
      newErrors.nik = 'NIK harus berupa 16 digit angka.';
    }
    
    // Full name validation
    if (form.fullName.trim().length < 3) {
      newErrors.fullName = 'Nama lengkap minimal harus terdiri atas 3 karakter.';
    }

    // Phone number validation (Indonesian formats starting with 08 or +62 or 62)
    const phoneClean = form.phone.replace(/\D/g, '');
    if (phoneClean.length < 10 || phoneClean.length > 14) {
      newErrors.phone = 'Masukkan nomor HP aktif yang valid (10-14 digit).';
    }

    if (!form.job) {
      newErrors.job = 'Silakan pilih pekerjaan Anda.';
    }

    if (!form.monthlyIncome) {
      newErrors.monthlyIncome = 'Silakan pilih rentang penghasilan bulanan.';
    }

    if (!form.agreeToTerms) {
      newErrors.agreeToTerms = 'Anda harus mengonfirmasi kevalidan data & syarat ketentuan.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(form);
    }
  };

  const inputClass = (field: string) => `
    w-full px-4 py-3 border rounded-xl font-sans text-gray-900 transition-all placeholder-gray-400
    ${errors[field] 
      ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500 bg-red-50/10' 
      : 'border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
    }
  `;

  return (
    <div id="form-step" className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Visual Identity Header */}
      <div className="bg-emerald-600 px-6 py-8 text-white relative">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Langkah 1 dari 3</span>
          <span className="bg-emerald-500/30 text-emerald-100 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
            <Sparkles size={12} /> Data Terenkripsi
          </span>
        </div>
        <h2 className="text-2xl font-bold font-sans">Formulir Pengajuan</h2>
        <p className="text-sm text-emerald-100 mt-1">Lengkapi informasi pribadi Anda dengan benar untuk pengecekan skor kredit instan.</p>
      </div>

      {/* Loan Snapshot Ribbon */}
      <div className="bg-emerald-50 border-b border-emerald-100 py-3 px-6 flex justify-between items-center text-xs sm:text-sm">
        <span className="text-emerald-800 font-medium">Rencana Kredit Terpilih:</span>
        <span className="font-bold text-emerald-950">
          {formatRupiah(loan.amount)} <span className="text-gray-400">/</span> {loan.tenor} Bulan
        </span>
      </div>

      <div className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NIK */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nomor Induk Kependudukan (NIK KTP / Kartu Keluarga)
            </label>
            <input
              type="text"
              maxLength={16}
              value={form.nik}
              onChange={(e) => setForm({ ...form, nik: e.target.value.replace(/\D/g, '') })}
              placeholder="16-digit nomor NIK sesuai KTP"
              className={inputClass('nik')}
            />
            {errors.nik ? (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.nik}
              </p>
            ) : (
              <p className="text-gray-400 text-xs mt-1">Sesuai KTP resmi terbitan Dukcapil.</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nama Lengkap (Sesuai KTP & Buku Rekening)
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Contoh: BUDI SANTOSO"
              className={inputClass('fullName')}
            />
            {errors.fullName ? (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.fullName}
              </p>
            ) : (
              <p className="text-gray-400 text-xs mt-1">Pastikan nama sama persis dengan rekening tujuan pencairan nanti.</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nomor Handphone Terdaftar / Aktif (Whatsapp)
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^\d+]/g, '') })}
              placeholder="Mulai dengan 08 / +62..."
              className={inputClass('phone')}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.phone}
              </p>
            )}
          </div>

          {/* Job/Profession */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Pekerjaan Utama
            </label>
            <select
              value={form.job}
              onChange={(e) => setForm({ ...form, job: e.target.value })}
              className={inputClass('job')}
            >
              <option value="">-- Pilih Pekerjaan --</option>
              <option value="Karyawan Swasta">Karyawan Swasta</option>
              <option value="Aparatur Sipil Negara / PNS">Aparatur Sipil Negara / PNS</option>
              <option value="Wiraswata / Pengusaha">Wiraswata / Pengusaha</option>
              <option value="Pegawai BUMN">Pegawai BUMN</option>
              <option value="Pekerja Lepas / Freelance">Pekerja Lepas / Freelance</option>
              <option value="Pengurus Rumah Tangga">Pengurus Rumah Tangga</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            {errors.job && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.job}
              </p>
            )}
          </div>

          {/* Income range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Penghasilan Bulanan Bersih
            </label>
            <select
              value={form.monthlyIncome}
              onChange={(e) => setForm({ ...form, monthlyIncome: e.target.value })}
              className={inputClass('monthlyIncome')}
            >
              <option value="">-- Pilih Rentang Pendapatan --</option>
              <option value="Di bawah Rp 3.000.000">Di bawah Rp 3.000.000</option>
              <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
              <option value="Rp 5.000.000 - Rp 10.000.000">Rp 5.000.000 - Rp 10.000.000</option>
              <option value="Rp 10.000.000 - Rp 20.000.000">Rp 10.000.000 - Rp 20.000.000</option>
              <option value="Di atas Rp 20.000.000">Di atas Rp 20.000.000</option>
            </select>
            {errors.monthlyIncome && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.monthlyIncome}
              </p>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agreeToTerms}
                onChange={(e) => setForm({ ...form, agreeToTerms: e.target.checked })}
                className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded focus:border-emerald-500"
              />
              <span className="text-xs sm:text-sm text-gray-600 leading-normal">
                Saya menyatakan dengan kesadaran penuh bahwa seluruh data yang diisi adalah benar, sah, dan dapat dipertanggungjawabkan di hadapan hukum.
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.agreeToTerms}
              </p>
            )}
          </div>

          {/* Shield Badge */}
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl text-slate-500 text-xs justify-center border border-slate-100">
            <Shield size={14} className="text-slate-400" />
            <span>Kerahasiaan data aman dijamin oleh sistem enkripsi SSL 256-bit.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onPrev}
              className="flex-1 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-all active:scale-[0.98] border border-gray-200 rounded-2xl"
            >
              Kembali
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200 inline-flex items-center justify-center gap-1.5 active:scale-[0.98] rounded-2xl"
            >
              Lanjutkan Ke Tanda Tangan
              <ChevronRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
