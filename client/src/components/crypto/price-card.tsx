import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';

interface Cryptocurrency {
  id: number;
  symbol: string;
  name: string;
  current_price?: number;
  price_change_24h?: number;
}

export function PriceCard() {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptocurrencies = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest('GET', '/api/v1/prices');
        const data = await response.json();
        if (data && data.data) {
          setCryptocurrencies(data.data.slice(0, 5)); // Get top 5 cryptos
        }
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch cryptocurrency data');
        setIsLoading(false);
      }
    };

    fetchCryptocurrencies();
    // Update prices every 30 seconds
    const interval = setInterval(fetchCryptocurrencies, 30000);
    return () => clearInterval(interval);
  }, []);

  // Map of symbols to currency icons
  const currencyIcons: Record<string, string> = {
    BTC: '₿',
    ETH: 'Ξ',
    SOL: '◎',
    DOGE: 'Ð',
    ADA: '⓵',
  };

  // Map of symbols to text colors
  const symbolColors: Record<string, string> = {
    BTC: 'text-amber-400',
    ETH: 'text-blue-400',
    SOL: 'text-slate-400',
    DOGE: 'text-slate-400',
    ADA: 'text-slate-400',
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <div className="p-4">
          <h3 className="text-lg font-medium text-white mb-4">Latest Price Updates</h3>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-700 animate-pulse h-12" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <div className="p-4">
          <h3 className="text-lg font-medium text-white mb-4">Latest Price Updates</h3>
          <div className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded">
            {error}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <div className="p-4">
        <h3 className="text-lg font-medium text-white mb-4">Latest Price Updates</h3>
        <div className="space-y-3">
          {cryptocurrencies.map((crypto) => (
            <div key={crypto.id} className="flex items-center justify-between p-2 rounded bg-slate-700">
              <div className="flex items-center">
                <span className={`${symbolColors[crypto.symbol] || 'text-slate-400'} mr-2`}>
                  {currencyIcons[crypto.symbol] || crypto.symbol[0]}
                </span>
                <span className="font-medium text-white">{crypto.name}</span>
              </div>
              <div className="text-right">
                <div className="font-medium text-white">
                  ${crypto.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                </div>
                <div className={`text-sm ${
                  (crypto.price_change_24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {(crypto.price_change_24h || 0) >= 0 ? '+' : ''}{crypto.price_change_24h}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
