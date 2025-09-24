export interface User {
  username: string;
  role: string;
}

export interface Client {
  id: string;
  client: string;
}

export interface Account {
  id: string;
  akun: string;
}

export interface Transaction {
  id: string;
  tanggal: string;
  client: string;
  debet: number;
  credit: number;
  akun: string;
  keterangan: string;
}

export interface SummaryData {
  totalBalance: { client: string; balance: number }[];
  monthlyRevenue: { client: string; ym: string; revenue: number }[];
  dailyTransactions: { client: string; date: string; trx: number }[];
}
