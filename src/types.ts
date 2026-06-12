export interface LoanDetails {
  amount: number;
  tenor: number; // in months
  monthlyRepayment: number;
}

export interface UserForm {
  nik: string;
  fullName: string;
  phone: string;
  job: string;
  monthlyIncome: string;
  agreeToTerms: boolean;
}

export interface WithdrawalDetails {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export type AppStep =
  | 'calculator'
  | 'form'
  | 'signature'
  | 'stamp-payment'
  | 'dashboard-withdraw'
  | 'approval-status';

export interface AppState {
  step: AppStep;
  loan: LoanDetails;
  form: UserForm;
  signatureData: string; // base64 image or typed
  receiptImage: string | null;
  withdrawal: WithdrawalDetails;
  registrationBonus: number;
  appliedAt: string;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
}
