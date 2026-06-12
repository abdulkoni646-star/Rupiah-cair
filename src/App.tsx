import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AppState, 
  AppStep, 
  LoanDetails, 
  UserForm, 
  WithdrawalDetails 
} from './types';

// Components
import FormulirLengkap from './components/FormulirLengkap';
import SignaturePad from './components/SignaturePad';
import PembayaranMeterai from './components/PembayaranMeterai';
import DashboardCairkan from './components/DashboardCairkan';
import StatusPengajuan from './components/StatusPengajuan';

// Icons
import { 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  Info, 
  CheckCircle, 
  Hand, 
  Award, 
  Lock, 
  ArrowRightLeft 
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'rupiah_cair_app_state';

const defaultForm: UserForm = {
  nik: '',
  fullName: '',
  phone: '',
  job: '',
  monthlyIncome: '',
  agreeToTerms: false,
};

const defaultWithdrawal: WithdrawalDetails = {
  bankName: '',
  accountNumber: '',
  accountHolder: '',
};

export default function App() {
  // Read state from localStorage on load
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch (e) {
      console.error('Error reading localStorage', e);
    }
    
    return {
      step: 'calculator',
      loan: {
        amount: 5000000,
        tenor: 6,
        monthlyRepayment: 0, // calculate on fly
      },
      form: defaultForm,
      signatureData: '',
      receiptImage: null,
      withdrawal: defaultWithdrawal,
      registrationBonus: 80000,
      appliedAt: '',
      transactionId: '',
      status: 'pending',
    };
  });

  // Write changes to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Recalculate monthly repayment dynamically when loan amount/tenor changes
  const calculateRepayment = (amount: number, tenor: number) => {
    const flatInterestRate = 0.015; // 1.5% flat interest per month
    const interest = amount * flatInterestRate * tenor;
    const total = amount + interest;
    return Math.round(total / tenor);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(e.target.value);
    setState(prev => ({
      ...prev,
      loan: {
        ...prev.loan,
        amount,
        monthlyRepayment: calculateRepayment(amount, prev.loan.tenor)
      }
    }));
  };

  const handleTenorChange = (tenor: number) => {
    setState(prev => ({
      ...prev,
      loan: {
        ...prev.loan,
        tenor,
        monthlyRepayment: calculateRepayment(prev.loan.amount, tenor)
      }
    }));
  };

  useEffect(() => {
    setState(prev => ({
      ...prev,
      loan: {
        ...prev.loan,
        monthlyRepayment: calculateRepayment(prev.loan.amount, prev.loan.tenor)
      }
    }));
  }, []);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mengatur ulang data pengajuan ini?')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setState({
        step: 'calculator',
        loan: {
          amount: 5000000,
          tenor: 6,
          monthlyRepayment: calculateRepayment(5000000, 6),
        },
        form: defaultForm,
        signatureData: '',
        receiptImage: null,
        withdrawal: defaultWithdrawal,
        registrationBonus: 80000,
        appliedAt: '',
        transactionId: '',
        status: 'pending',
      });
    }
  };

  const transitionTo = (nextStep: AppStep) => {
    // Scroll window smoothly to step element on change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setState(prev => ({ ...prev, step: nextStep }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-500 selection:text-white flex flex-col justify-between">
      {/* Visual Identity Navigation Rail / Header */}
      <nav className="w-full bg-white border-b border-gray-100 py-4 px-6 sm:px-8 flex justify-between items-center sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-600 text-white font-extrabold h-9 w-9 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200">
            RC
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-950 font-sans block leading-none">Rupiah Cair</span>
            <span className="text-[10px] text-gray-400 font-medium">Pinjaman Digital Cepat & Berizin</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            <ShieldCheck size={14} /> Berizin & Diawasi Keuangan
          </div>
          {state.step !== 'calculator' && (
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors bg-red-50 hover:bg-red-100/50 px-3 py-1.5 rounded-xl border border-red-100"
            >
              Reset Data
            </button>
          )}
        </div>
      </nav>

      {/* Main Container Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {state.step === 'calculator' && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto w-full space-y-8"
            >
              {/* Promo Banner */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-1 bg-emerald-100/60 border border-emerald-200 text-emerald-800 text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-sm">
                  <Sparkles size={13} className="text-emerald-600 fill-emerald-600" />
                  PROMO AKHIR BULAN: BONUS REGISTRASI RP 80.000
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Pinjaman Digital Dana Cair <br className="hidden sm:inline" />
                  <span className="text-emerald-600 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Tanpa Ribet, Cicilan Ringan</span>
                </h1>
                <p className="max-w-xl mx-auto text-sm sm:text-base text-gray-500 leading-relaxed font-normal">
                  Ajukan limit pinjaman saldo hari ini, selesaikan kelengkapan berkas kontrak meterai digital, dapatkan bonus registrasi Rp 80.000 tunai!
                </p>
              </div>

              {/* Slider Panel Box */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Sliders and choices (Left side 7-columns) */}
                <div className="md:col-span-7 space-y-6">
                  <h2 className="text-lg font-bold text-gray-900">Hitung Simulasi Pinjaman</h2>

                  {/* Amount slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-gray-500">Jumlah Pinjaman</span>
                      <span className="text-emerald-600 text-lg font-extrabold font-mono">{formatRupiah(state.loan.amount)}</span>
                    </div>
                    <input
                      type="range"
                      min={1000000}
                      max={20000000}
                      step={500000}
                      value={state.loan.amount}
                      onChange={handleAmountChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-[11px] text-gray-400 font-bold">
                      <span>Rp 1.000.000</span>
                      <span>Rp 10.000.000</span>
                      <span>Rp 20.000.000</span>
                    </div>
                  </div>

                  {/* Tenor Select Buttons */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-500">
                      Tenor Pembayaran (Bulan)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[3, 6, 9, 12].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => handleTenorChange(m)}
                          className={`
                            py-3 text-sm font-bold text-center rounded-xl transition-all active:scale-[0.97] cursor-pointer
                            ${state.loan.tenor === m
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                            }
                          `}
                        >
                          {m} Bln
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Key checklist items */}
                  <div className="pt-4 grid grid-cols-2 gap-3 text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">✓</div>
                      <span>Tanpa jaminan (KTP saja)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">✓</div>
                      <span>Bunga ringan bersahabat</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">✓</div>
                      <span>Persetujuan instan digital</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">✓</div>
                      <span>Dapat Bonus Registrasi Rp 80k</span>
                    </div>
                  </div>
                </div>

                {/* Estimation Results Panel (Right side 5-columns) */}
                <div className="md:col-span-5 bg-slate-950 text-white rounded-2xl p-6 flex flex-col justify-between space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                    <Award size={90} className="text-emerald-400" />
                  </div>

                  <div className="space-y-4">
                    <span className="inline-block bg-slate-900 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-md">
                      Estimasi Rincian Kredit
                    </span>

                    <div className="space-y-3 font-sans">
                      <div>
                        <span className="text-xs text-slate-400 block font-normal">Cicilan Bulanan Anda</span>
                        <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
                          {formatRupiah(state.loan.monthlyRepayment)} <span className="text-slate-400 text-xs font-sans">/ bln</span>
                        </span>
                      </div>

                      <div className="pt-3 border-t border-slate-900 space-y-1.5 text-xs text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Pengajuan Pokok:</span>
                          <span className="font-semibold text-white">{formatRupiah(state.loan.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tenor Kredit:</span>
                          <span className="font-semibold text-white">{state.loan.tenor} Bulan</span>
                        </div>
                        <div className="flex justify-between items-center text-emerald-400 font-semibold">
                          <span className="flex items-center gap-1">Bonus Registrasi Tunai:</span>
                          <span>+ {formatRupiah(state.registrationBonus)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => transitionTo('form')}
                      className="w-full py-4 text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-lg shadow-emerald-950/20 rounded-xl inline-flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
                    >
                      AJUKAN SEKARANG JUGA
                      <ChevronRight size={16} />
                    </button>
                    <p className="text-[10px] text-slate-400 text-center font-normal mt-2 flex items-center justify-center gap-1">
                      <Lock size={10} /> Data dijamin aman & tersertifikasi ISO 27001
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {state.step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <FormulirLengkap
                initialForm={state.form}
                loan={state.loan}
                onSave={(form) => {
                  setState(prev => ({ ...prev, form }));
                  transitionTo('signature');
                }}
                onPrev={() => transitionTo('calculator')}
              />
            </motion.div>
          )}

          {state.step === 'signature' && (
            <motion.div
              key="signature"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <SignaturePad
                initialSignature={state.signatureData}
                onSave={(signatureData) => {
                  setState(prev => ({ ...prev, signatureData }));
                  transitionTo('stamp-payment');
                }}
                onPrev={() => transitionTo('form')}
              />
            </motion.div>
          )}

          {state.step === 'stamp-payment' && (
            <motion.div
              key="stamp-payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <PembayaranMeterai
                onConfirm={(receiptImage) => {
                  setState(prev => ({ ...prev, receiptImage }));
                  transitionTo('dashboard-withdraw');
                }}
                onPrev={() => transitionTo('signature')}
              />
            </motion.div>
          )}

          {state.step === 'dashboard-withdraw' && (
            <motion.div
              key="dashboard-withdraw"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardCairkan
                loan={state.loan}
                initialFullName={state.form.fullName}
                registrationBonus={state.registrationBonus}
                onCairkan={(withdrawal) => {
                  // Finalizing transaction logs
                  const generatedId = `RC-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2, '0')}-${Math.floor(100000 + Math.random() * 900000)}`;
                  setState(prev => ({
                    ...prev,
                    withdrawal,
                    transactionId: generatedId,
                    appliedAt: new Date().toISOString(),
                    status: 'pending'
                  }));
                  transitionTo('approval-status');
                }}
              />
            </motion.div>
          )}

          {state.step === 'approval-status' && (
            <motion.div
              key="approval-status"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StatusPengajuan
                state={state}
                onReset={() => {
                  localStorage.removeItem(LOCAL_STORAGE_KEY);
                  setState({
                    step: 'calculator',
                    loan: {
                      amount: 5000000,
                      tenor: 6,
                      monthlyRepayment: calculateRepayment(5000000, 6),
                    },
                    form: defaultForm,
                    signatureData: '',
                    receiptImage: null,
                    withdrawal: defaultWithdrawal,
                    registrationBonus: 80000,
                    appliedAt: '',
                    transactionId: '',
                    status: 'pending',
                  });
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="w-full bg-slate-900 text-slate-400 py-8 px-6 sm:px-8 text-center border-t border-slate-800 text-xs mt-12 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
          <div className="text-left space-y-1">
            <p className="font-bold text-white text-sm">Rupiah Cair Finansial Mandiri (PT RCFM)</p>
            <p>Berizin dan diawasi oleh Otoritas Jasa Keuangan (OJK) Republik Indonesia.</p>
          </div>
          <p className="text-slate-500 max-w-md sm:text-right text-[10px] leading-relaxed">
            Perjanjian pinjaman adalah perjanjian hukum formal yang diikat oleh hukum bea meterai undang-undang No 10 Tahun 2020. Data dilindungi dan terdaftar di dalam platform Asosiasi Fintech Pendanaan Bersama Indonesia (AFPI).
          </p>
        </div>
        <p className="text-center pt-4 border-t border-slate-800 text-[10px] text-slate-500">
          © {new Date().getFullYear()} Rupiah Cair. All rights reserved. • Ver-G3.5.2
        </p>
      </footer>
    </div>
  );
}
