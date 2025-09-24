import type { User, Client, Transaction, SummaryData } from '../types';

const API_URL = "https://script.google.com/macros/s/AKfycbzuErTDEIJHha2vEF7t5tqcnCUHF_dUdhQHVeYcbcF0LRwPe4qHr3DCPu0DOzDqUvBOJw/exec"; // ganti dengan URL kamu

async function post(params: Record<string, string | number | boolean>) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(params as any),
      redirect: "follow",
    });

    if (!res.ok) {
      throw new Error(`Server returned an error: ${res.status} ${res.statusText}`);
    }

    const responseText = await res.text();
    if (!responseText) {
        throw new Error("Received an empty response from the server.");
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Gagal mem-parsing JSON dari server. Respon:", responseText);
      throw new Error("Server memberikan respon yang tidak valid. Ini bisa terjadi jika ada error di backend atau URL salah.");
    }
    
    if (data.ok === false) {
      throw new Error(data.error || "Request ditolak oleh server.");
    }
    
    return data;

  } catch (error) {
    console.error("Terjadi kesalahan pada request:", error);
    if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
             throw new Error("Gagal terhubung ke server. Periksa koneksi internet Anda atau hubungi administrator.");
        }
    }
    throw error;
  }
}

function mapRowsToObjects<T>(headers: string[], rows: any[][]): T[] {
    const lowerCaseHeaders = headers.map(h => h.toLowerCase().trim());
    return rows.map((row, index) => {
        const obj: any = { id: String(index + 1) }; // Gunakan row index + 1 sebagai ID
        lowerCaseHeaders.forEach((header, i) => {
            // Gunakan 'client' di frontend untuk header 'Client' dari GSheet
            const key = header === 'client' ? 'client' : header; 
            if (header === 'debet' || header === 'credit') {
                 obj[key] = Number(row[i] || 0);
            } else {
                 obj[key] = row[i];
            }
        });
        return obj as T;
    });
}


// ===================================================================
// AUTH
// ===================================================================
export async function login(username: string, password: string): Promise<User> {
  const data = await post({ action: "login", username, password });
  
  // FIX: Make login more robust to handle multiple backend response formats.
  
  // Check 1: Ideal nested format.
  if (data.user && data.user.username && data.user.role) {
    return data.user;
  }
  
  // Check 2: Fallback flat format with username.
  if (data.username && data.role) {
      return { username: data.username, role: data.role };
  }

  // Check 3: Fallback for older backend that only returns role.
  // Since login was successful, we can safely use the username from the form.
  if (data.role) {
      return { username: username, role: data.role };
  }

  // If all checks fail, throw a more informative error for debugging.
  const receivedKeys = Object.keys(data).join(', ');
  throw new Error(`Login berhasil tetapi data pengguna tidak valid. Properti yang diterima: [${receivedKeys}]`);
}


// ===================================================================
// USERS
// ===================================================================
export async function addUser(username: string, role: string, password: string): Promise<User> {
  await post({ action: "addUser", username, role, password });
  return { username, role };
}

// ===================================================================
// CLIENTS
// ===================================================================
export async function addClient(clientName: string): Promise<Client> {
  await post({ action: "addClient", clientName: clientName });
  return { id: clientName, client: clientName };
}

// ===================================================================
// TRANSACTIONS
// ===================================================================
export async function getTransactions(): Promise<Transaction[]> {
  const data = await post({ action: "getTransactions" });
  return mapRowsToObjects<Transaction>(data.headers, data.rows);
}

export async function updateTransactionAccount(transactionId: string, newAccountName: string): Promise<void> {
  const rowIndex = parseInt(transactionId, 10) - 1;
  await post({ action: "updateTransaction", rowIndex: rowIndex, akun: newAccountName });
}

export async function uploadDatabase(newData: Record<string, any>[]): Promise<{ count: number }> {
  // Data dikirim apa adanya, mengandalkan header CSV yang benar.
  const payload = JSON.stringify(newData);
  const data = await post({ action: "uploadDatabase", records: payload });
  return { count: data.count };
}


// ===================================================================
// SUMMARY
// ===================================================================
export async function getSummaryData(): Promise<SummaryData> {
  const data = await post({ action: "getSummary" });
  
  // Menyelaraskan data dari backend (yang mungkin menggunakan 'partner') dengan tipe frontend ('client')
  if (data.summary && data.summary.totalBalance) {
     const alignedSummary: SummaryData = {
          totalBalance: data.summary.totalBalance.map((item: any) => ({
            client: item.client || item.partner, // Map 'partner' or 'client' to 'client'
            balance: item.balance,
          })),
          monthlyRevenue: (data.summary.monthlyRevenue || []).map((item: any) => ({
            client: item.client || item.partner,
            ym: item.ym,
            revenue: item.revenue,
          })),
          dailyTransactions: (data.summary.dailyTransactions || []).map((item: any) => ({
            client: item.client || item.partner,
            date: item.date,
            trx: item.trx,
          })),
        };
        return alignedSummary;
  }
  
  console.warn("Menerima data ringkasan kosong atau tidak valid dari backend.");
  // Mengembalikan struktur kosong yang valid untuk mencegah error
  return {
    totalBalance: [],
    monthlyRevenue: [],
    dailyTransactions: [],
  };
}
