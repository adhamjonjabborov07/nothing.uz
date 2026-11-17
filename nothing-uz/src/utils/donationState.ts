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

const STORAGE_KEY = 'nothing_donations_data';

// Realistic initial baseline
const BASE_STATS: DonationStats = {
  totalAmount: 148250000, // 148,250,000 UZS
  donorCount: 4210,
  recentDonations: [
    {
      id: 'init-1',
      name: 'Azizbek K.',
      amount: 50000,
      message: 'Eng halol kompaniya! 0% va’da, 100% natija.',
      timestamp: Date.now() - 1000 * 60 * 12,
    },
    {
      id: 'init-2',
      name: 'Elena Rostova',
      amount: 22222,
      message: 'Ничего не получила. Рекомендую всем!',
      timestamp: Date.now() - 1000 * 60 * 35,
    },
    {
      id: 'init-3',
      name: 'Farxod Toshmatov',
      amount: 11111,
      message: 'Nothing uchun oxirgi pulimni berdim.',
      timestamp: Date.now() - 1000 * 60 * 75,
    },
    {
      id: 'init-4',
      name: 'Anonymous Donor',
      amount: 100000,
      message: 'Take my money for literally nothing.',
      timestamp: Date.now() - 1000 * 60 * 180,
    },
    {
      id: 'init-5',
      name: 'Shaxnoza',
      amount: 33333,
      message: 'Ultra Nothing obunachisi!',
      timestamp: Date.now() - 1000 * 60 * 320,
    },
  ],
};

export function getDonationStats(): DonationStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(BASE_STATS));
      return BASE_STATS;
    }
    const data = JSON.parse(raw);
    return {
      totalAmount: Number(data.totalAmount) || BASE_STATS.totalAmount,
      donorCount: Number(data.donorCount) || BASE_STATS.donorCount,
      recentDonations: Array.isArray(data.recentDonations) ? data.recentDonations : BASE_STATS.recentDonations,
    };
  } catch {
    return BASE_STATS;
  }
}

export function recordDonation(amount: number, name?: string, message?: string): DonationStats {
  const current = getDonationStats();
  const validAmount = Math.max(1000, amount);
  const donorName = name?.trim() || 'Anonymous Supporter';

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
