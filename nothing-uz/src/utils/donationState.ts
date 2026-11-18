export interface DonationItem {
  id: string;
  name: string;
  amount: number;
  message?: string;
  timestamp: number;
  isNew?: boolean;
}

export interface DonationStats {
  totalAmount: number;
  donorCount: number;
  recentDonations: DonationItem[];
}

const STORAGE_KEY = 'nothing_donations_data_v2';

// Boshlang'ich holat: Hali to'lovlar tushmagan, barchasi 0 UZS
const BASE_STATS: DonationStats = {
  totalAmount: 0,
  donorCount: 0,
  recentDonations: [],
};

export function getDonationStats(): DonationStats {
  try {
    // Clear old fake data if present
    localStorage.removeItem('nothing_donations_data');

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(BASE_STATS));
      return BASE_STATS;
    }
    const data = JSON.parse(raw);
    return {
      totalAmount: Number(data.totalAmount) || 0,
      donorCount: Number(data.donorCount) || 0,
      recentDonations: Array.isArray(data.recentDonations) ? data.recentDonations : [],
    };
  } catch {
    return BASE_STATS;
  }
}

export function recordDonation(amount: number, name?: string, message?: string): DonationStats {
  const current = getDonationStats();
  const validAmount = Math.max(1000, amount);
  const donorName = name?.trim() || 'Saxovatli homiy';

  const newDonation: DonationItem = {
    id: `don-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: donorName,
    amount: validAmount,
    message: message?.trim(),
    timestamp: Date.now(),
    isNew: true,
  };

  const updated: DonationStats = {
    totalAmount: current.totalAmount + validAmount,
    donorCount: current.donorCount + 1,
    recentDonations: [newDonation, ...current.recentDonations.slice(0, 19)],
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save donation:', e);
  }

  // Dispatch global event for live reactivity across all components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nothing-donation-updated', { detail: updated }));
  }

  return updated;
}
