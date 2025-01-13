import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { translations, type Language } from "@/utils/i18n";

interface StockSelectorProps {
  onSelect: (symbol: string) => void;
  market: string;
  lang?: Language;
}

const stocksByMarket = {
  US: [
    { symbol: 'AAPL', name: 'Apple Inc.', description: 'Technology' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', description: 'Semiconductors' },
    { symbol: 'MSFT', name: 'Microsoft', description: 'Technology' },
    { symbol: 'GOOG', name: 'Alphabet Inc.', description: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com', description: 'E-commerce' },
    { symbol: 'META', name: 'Meta Platforms', description: 'Technology' },
    { symbol: 'TSLA', name: 'Tesla Inc.', description: 'Automotive' },
    { symbol: 'AVGO', name: 'Broadcom Inc.', description: 'Semiconductors' },
    { symbol: 'BRK-B', name: 'Berkshire Hathaway', description: 'Conglomerate' },
    { symbol: 'WMT', name: 'Walmart', description: 'Retail' },
    { symbol: 'LLY', name: 'Eli Lilly', description: 'Healthcare' },
    { symbol: 'JPM', name: 'JPMorgan Chase', description: 'Banking' },
    { symbol: 'V', name: 'Visa Inc.', description: 'Financial Services' },
    { symbol: 'UNH', name: 'UnitedHealth Group', description: 'Healthcare' },
    { symbol: 'XOM', name: 'ExxonMobil', description: 'Energy' },
    { symbol: 'MA', name: 'Mastercard', description: 'Financial Services' },
    { symbol: 'ORCL', name: 'Oracle', description: 'Technology' },
    { symbol: 'COST', name: 'Costco', description: 'Retail' },
    { symbol: 'HD', name: 'Home Depot', description: 'Retail' },
    { symbol: 'PG', name: 'Procter & Gamble', description: 'Consumer Goods' },
    { symbol: 'NFLX', name: 'Netflix', description: 'Entertainment' },
    { symbol: 'BAC', name: 'Bank of America', description: 'Banking' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', description: 'Healthcare' },
    { symbol: 'ABBV', name: 'AbbVie', description: 'Healthcare' },
    { symbol: 'CRM', name: 'Salesforce', description: 'Technology' },
    { symbol: 'CVX', name: 'Chevron', description: 'Energy' },
    { symbol: 'KO', name: 'Coca-Cola', description: 'Beverages' },
    { symbol: 'MRK', name: 'Merck', description: 'Healthcare' },
    { symbol: 'TMUS', name: 'T-Mobile US', description: 'Telecommunications' },
    { symbol: 'CSCO', name: 'Cisco Systems', description: 'Technology' },
    { symbol: 'WFC', name: 'Wells Fargo', description: 'Banking' },
    { symbol: 'NOW', name: 'ServiceNow', description: 'Technology' },
    { symbol: 'TMO', name: 'Thermo Fisher', description: 'Healthcare' },
    { symbol: 'AXP', name: 'American Express', description: 'Financial Services' },
    { symbol: 'IBM', name: 'IBM', description: 'Technology' },
    { symbol: 'MCD', name: "McDonald's", description: 'Restaurants' },
    { symbol: 'MS', name: 'Morgan Stanley', description: 'Banking' },
    { symbol: 'DIS', name: 'Walt Disney', description: 'Entertainment' },
    { symbol: 'PEP', name: 'PepsiCo', description: 'Beverages' },
    { symbol: 'ISRG', name: 'Intuitive Surgical', description: 'Healthcare' },
    { symbol: 'ABT', name: 'Abbott Laboratories', description: 'Healthcare' },
    { symbol: 'AMD', name: 'Advanced Micro Devices', description: 'Semiconductors' },
    { symbol: 'GE', name: 'General Electric', description: 'Industrials' },
    { symbol: 'PM', name: 'Philip Morris', description: 'Tobacco' },
    { symbol: 'ADBE', name: 'Adobe Inc.', description: 'Technology' },
    { symbol: 'GS', name: 'Goldman Sachs', description: 'Banking' },
    { symbol: 'INTU', name: 'Intuit', description: 'Technology' },
    { symbol: 'QCOM', name: 'Qualcomm', description: 'Semiconductors' },
    { symbol: 'TXN', name: 'Texas Instruments', description: 'Semiconductors' },
    { symbol: 'DHR', name: 'Danaher', description: 'Healthcare' },
    { symbol: 'CAT', name: 'Caterpillar', description: 'Industrials' },
    { symbol: 'VZ', name: 'Verizon', description: 'Telecommunications' },
    { symbol: 'BKNG', name: 'Booking Holdings', description: 'Travel' },
    { symbol: 'T', name: 'AT&T', description: 'Telecommunications' },
    { symbol: 'PLTR', name: 'Palantir Technologies', description: 'Software' },
    { symbol: 'RTX', name: 'RTX Corporation', description: 'Aerospace & Defense' },
    { symbol: 'PFE', name: 'Pfizer', description: 'Healthcare' },
    { symbol: 'SPGI', name: 'S&P Global', description: 'Financial Services' },
    { symbol: 'BLK', name: 'BlackRock', description: 'Asset Management' },
    { symbol: 'ANET', name: 'Arista Networks', description: 'Technology' },
    { symbol: 'HON', name: 'Honeywell', description: 'Industrials' },
    { symbol: 'AMGN', name: 'Amgen', description: 'Healthcare' },
    { symbol: 'LOW', name: "Lowe's", description: 'Retail' },
    { symbol: 'BSX', name: 'Boston Scientific', description: 'Healthcare' },
    { symbol: 'AMAT', name: 'Applied Materials', description: 'Semiconductors' },
    { symbol: 'SYK', name: 'Stryker', description: 'Healthcare' },
    { symbol: 'CMCSA', name: 'Comcast', description: 'Media' },
    { symbol: 'UBER', name: 'Uber Technologies', description: 'Transportation' },
    { symbol: 'NEE', name: 'NextEra Energy', description: 'Utilities' },
    { symbol: 'PGR', name: 'Progressive', description: 'Insurance' },
    { symbol: 'UNP', name: 'Union Pacific', description: 'Transportation' },
    { symbol: 'C', name: 'Citigroup', description: 'Banking' },
    { symbol: 'TJX', name: 'TJX Companies', description: 'Retail' },
    { symbol: 'SCHW', name: 'Charles Schwab', description: 'Financial Services' },
    { symbol: 'COP', name: 'ConocoPhillips', description: 'Energy' },
    { symbol: 'KKR', name: 'KKR & Co.', description: 'Asset Management' },
    { symbol: 'BA', name: 'Boeing', description: 'Aerospace' },
    { symbol: 'BX', name: 'Blackstone', description: 'Asset Management' },
    { symbol: 'ADP', name: 'ADP', description: 'Business Services' },
    { symbol: 'FI', name: 'Fiserv', description: 'Financial Technology' },
    { symbol: 'PANW', name: 'Palo Alto Networks', description: 'Cybersecurity' },
    { symbol: 'BMY', name: 'Bristol Myers Squibb', description: 'Healthcare' },
    { symbol: 'GILD', name: 'Gilead Sciences', description: 'Healthcare' },
    { symbol: 'DE', name: 'Deere & Company', description: 'Industrials' },
    { symbol: 'LMT', name: 'Lockheed Martin', description: 'Aerospace & Defense' },
    { symbol: 'MU', name: 'Micron Technology', description: 'Semiconductors' },
    { symbol: 'APP', name: 'AppLovin', description: 'Technology' },
    { symbol: 'VRTX', name: 'Vertex Pharmaceuticals', description: 'Healthcare' },
    { symbol: 'ADI', name: 'Analog Devices', description: 'Semiconductors' },
    { symbol: 'NKE', name: 'Nike', description: 'Apparel' },
    { symbol: 'UPS', name: 'United Parcel Service', description: 'Logistics' },
    { symbol: 'SBUX', name: 'Starbucks', description: 'Restaurants' }
  ],
  Germany: [
    { symbol: 'SAP', name: 'SAP SE', description: 'Enterprise Software' },
    { symbol: 'SIE.DE', name: 'Siemens AG', description: 'Industrial Technology' },
    { symbol: 'DTE.DE', name: 'Deutsche Telekom', description: 'Telecommunications' },
    { symbol: 'ALV.DE', name: 'Allianz SE', description: 'Insurance' },
    { symbol: 'MUV2.DE', name: 'Munich Re', description: 'Insurance' },
    { symbol: 'MRK.DE', name: 'Merck KGaA', description: 'Healthcare' },
    { symbol: 'SHL.DE', name: 'Siemens Healthineers', description: 'Healthcare' },
    { symbol: 'P911.DE', name: 'Porsche AG', description: 'Automotive' },
    { symbol: 'MBG.DE', name: 'Mercedes-Benz Group', description: 'Automotive' },
    { symbol: 'BMW.DE', name: 'BMW AG', description: 'Automotive' },
    { symbol: 'VOW3.DE', name: 'Volkswagen AG', description: 'Automotive' },
    { symbol: 'ADS.DE', name: 'Adidas AG', description: 'Apparel' },
    { symbol: 'ENR.F', name: 'Siemens Energy', description: 'Energy' },
    { symbol: 'IFX.DE', name: 'Infineon', description: 'Semiconductors' },
    { symbol: 'DB1.DE', name: 'Deutsche Börse', description: 'Financial Services' },
    { symbol: 'DHL.DE', name: 'Deutsche Post', description: 'Logistics' },
    { symbol: 'BAS.DE', name: 'BASF', description: 'Chemicals' },
    { symbol: 'DB', name: 'Deutsche Bank', description: 'Banking' },
    { symbol: 'HEN3.DE', name: 'Henkel', description: 'Consumer Goods' },
    { symbol: 'DTG.F', name: 'Daimler Truck', description: 'Commercial Vehicles' }
  ],
  UK: [
    { symbol: 'AZN', name: 'AstraZeneca', description: 'Healthcare' },
    { symbol: 'LIN', name: 'Linde plc', description: 'Chemicals' },
    { symbol: 'SHEL', name: 'Shell plc', description: 'Energy' },
    { symbol: 'HSBC', name: 'HSBC Holdings', description: 'Banking' },
    { symbol: 'ARM', name: 'ARM Holdings', description: 'Semiconductors' },
    { symbol: 'UL', name: 'Unilever', description: 'Consumer Goods' },
    { symbol: 'RIO', name: 'Rio Tinto', description: 'Mining' },
    { symbol: 'RELX', name: 'RELX plc', description: 'Information Analytics' },
    { symbol: 'BP', name: 'BP plc', description: 'Energy' },
    { symbol: 'BTI', name: 'British American Tobacco', description: 'Tobacco' },
    { symbol: 'LSEG.L', name: 'London Stock Exchange Group', description: 'Financial Markets' },
    { symbol: 'AON', name: 'Aon plc', description: 'Insurance' },
    { symbol: 'DEO', name: 'Diageo', description: 'Beverages' },
    { symbol: 'GSK', name: 'GSK plc', description: 'Healthcare' },
    { symbol: 'RR.L', name: 'Rolls-Royce', description: 'Aerospace' },
    { symbol: 'CPG.L', name: 'Compass Group', description: 'Food Service' },
    { symbol: 'NGG', name: 'National Grid', description: 'Utilities' },
    { symbol: 'BCS', name: 'Barclays', description: 'Banking' },
    { symbol: 'BA.L', name: 'BAE Systems', description: 'Defense' },
    { symbol: 'III.L', name: '3i Group', description: 'Investment' },
    { symbol: 'HLN', name: 'Haleon', description: 'Consumer Healthcare' },
    { symbol: 'RKT.L', name: 'Reckitt', description: 'Consumer Goods' },
    { symbol: 'LYG', name: 'Lloyds Banking', description: 'Banking' },
    { symbol: 'NWG', name: 'NatWest Group', description: 'Banking' },
    { symbol: 'AAL.L', name: 'Anglo American', description: 'Mining' },
    { symbol: 'CCEP', name: 'Coca-Cola Europacific', description: 'Beverages' },
    { symbol: 'FERG', name: 'Ferguson', description: 'Industrial Distribution' },
    { symbol: 'WTW', name: 'Willis Towers Watson', description: 'Insurance' },
    { symbol: 'STAN.L', name: 'Standard Chartered', description: 'Banking' },
    { symbol: 'TSCO.L', name: 'Tesco', description: 'Retail' },
    { symbol: 'IMB.L', name: 'Imperial Brands', description: 'Tobacco' },
    { symbol: 'AHT.L', name: 'Ashtead Group', description: 'Equipment Rental' },
    { symbol: 'SSE.L', name: 'SSE plc', description: 'Utilities' },
    { symbol: 'VOD', name: 'Vodafone Group', description: 'Telecommunications' },
    { symbol: 'ANTO.L', name: 'Antofagasta', description: 'Mining' },
    { symbol: 'PUK', name: 'Prudential', description: 'Insurance' },
    { symbol: 'IHG', name: 'InterContinental Hotels', description: 'Hotels' },
    { symbol: 'ABF.L', name: 'Associated British Foods', description: 'Food Processing' },
    { symbol: 'RPRX', name: 'Royalty Pharma', description: 'Healthcare' }
  ],
  Italy: [
    { symbol: 'RACE', name: 'Ferrari', description: 'Automotive' },
    { symbol: 'ENEL.MI', name: 'Enel', description: 'Utilities' },
    { symbol: 'ISP.MI', name: 'Intesa Sanpaolo', description: 'Banking' },
    { symbol: 'UCG.MI', name: 'UniCredit', description: 'Banking' },
    { symbol: 'G.MI', name: 'Assicurazioni Generali', description: 'Insurance' },
    { symbol: 'E', name: 'ENI', description: 'Energy' },
    { symbol: '1913.HK', name: 'Prada', description: 'Luxury Goods' },
    { symbol: 'PRY.MI', name: 'Prysmian', description: 'Industrial' },
    { symbol: 'PST.MI', name: 'Poste Italiane', description: 'Postal Services' },
    { symbol: 'LDO.MI', name: 'Leonardo', description: 'Aerospace & Defense' },
    { symbol: 'TRN.MI', name: 'Terna', description: 'Utilities' },
    { symbol: 'SRG.MI', name: 'Snam', description: 'Energy Infrastructure' },
    { symbol: 'MONC.MI', name: 'Moncler', description: 'Luxury Apparel' },
    { symbol: 'MB.MI', name: 'Mediobanca', description: 'Banking' },
    { symbol: 'BAMI.MI', name: 'Banco BPM', description: 'Banking' },
    { symbol: 'REC.MI', name: 'Recordati', description: 'Pharmaceuticals' },
    { symbol: 'FBK.MI', name: 'FinecoBank', description: 'Banking' },
    { symbol: 'INW.MI', name: 'Inwit', description: 'Telecommunications' },
    { symbol: 'EDNR.MI', name: 'Edison', description: 'Energy' },
    { symbol: 'BMED.MI', name: 'Banca Mediolanum', description: 'Banking' },
    { symbol: 'BMPS.MI', name: 'Banca Monte dei Paschi', description: 'Banking' },
    { symbol: 'BPE.MI', name: 'BPER Banca', description: 'Banking' },
    { symbol: 'UNI.MI', name: 'Unipol', description: 'Insurance' },
    { symbol: 'US.MI', name: 'UnipolSai', description: 'Insurance' },
    { symbol: 'BC.MI', name: 'Brunello Cucinelli', description: 'Luxury Goods' }
  ],
  France: [
    { symbol: 'MC.PA', name: 'LVMH', description: 'Luxury Goods' },
    { symbol: 'RMS.PA', name: 'Hermès', description: 'Luxury Goods' },
    { symbol: 'OR.PA', name: "L'Oréal", description: 'Personal Care' },
    { symbol: 'SU.PA', name: 'Schneider Electric', description: 'Industrial' },
    { symbol: 'TTE', name: 'TotalEnergies', description: 'Energy' },
    { symbol: 'SNY', name: 'Sanofi', description: 'Healthcare' },
    { symbol: 'CDI.PA', name: 'Christian Dior', description: 'Luxury Goods' },
    { symbol: 'EL.PA', name: 'EssilorLuxottica', description: 'Eyewear' },
    { symbol: 'SAF.PA', name: 'Safran', description: 'Aerospace' },
    { symbol: 'AI.PA', name: 'Air Liquide', description: 'Chemicals' },
    { symbol: 'CS.PA', name: 'AXA', description: 'Insurance' },
    { symbol: 'BNP.PA', name: 'BNP Paribas', description: 'Banking' },
    { symbol: 'DG.PA', name: 'Vinci', description: 'Construction' },
    { symbol: 'DSY.PA', name: 'Dassault Systèmes', description: 'Software' },
    { symbol: 'SGO.PA', name: 'Saint-Gobain', description: 'Construction Materials' },
    { symbol: 'BN.PA', name: 'Danone', description: 'Food Products' },
    { symbol: 'ACA.PA', name: 'Crédit Agricole', description: 'Banking' },
    { symbol: 'ENGI.PA', name: 'Engie', description: 'Utilities' },
    { symbol: 'HO.PA', name: 'Thales', description: 'Defense & Aerospace' },
    { symbol: 'KER.PA', name: 'Kering', description: 'Luxury Goods' },
    { symbol: 'RI.PA', name: 'Pernod Ricard', description: 'Beverages' },
    { symbol: 'CAP.PA', name: 'Capgemini', description: 'IT Services' },
    { symbol: 'ORA.PA', name: 'Orange', description: 'Telecommunications' },
    { symbol: 'LR.PA', name: 'Legrand', description: 'Electrical Equipment' },
    { symbol: 'PUB.PA', name: 'Publicis Groupe', description: 'Advertising' },
    { symbol: 'ML.PA', name: 'Michelin', description: 'Tires' },
    { symbol: 'GLE.PA', name: 'Société Générale', description: 'Banking' },
    { symbol: 'VIE.PA', name: 'Veolia', description: 'Utilities' },
    { symbol: 'BOL.PA', name: 'Bollore', description: 'Transportation' },
    { symbol: 'AM.PA', name: 'Dassault Aviation', description: 'Aerospace' },
    { symbol: 'BVI.PA', name: 'Bureau Veritas', description: 'Professional Services' },
    { symbol: 'RNO.PA', name: 'Renault', description: 'Automotive' }
  ],
  Netherlands: [
    { symbol: 'ING', name: 'ING Group', description: 'Banking' },
    { symbol: 'ADYEN.AS', name: 'Adyen', description: 'Payment Technology' },
    { symbol: 'UMG.AS', name: 'Universal Music Group', description: 'Entertainment' },
    { symbol: 'WKL.AS', name: 'Wolters Kluwer', description: 'Information Services' },
    { symbol: 'ARGX', name: 'argenx', description: 'Biotechnology' },
    { symbol: 'HEIA.AS', name: 'Heineken', description: 'Beverages' },
    { symbol: 'STLA', name: 'Stellantis', description: 'Automotive' },
    { symbol: 'EXO.AS', name: 'Exor', description: 'Investment Holding' },
    { symbol: 'AD.AS', name: 'Ahold Delhaize', description: 'Retail' },
    { symbol: 'ASM.AS', name: 'ASM International', description: 'Semiconductors' },
    { symbol: 'PHG', name: 'Philips', description: 'Healthcare Technology' },
    { symbol: 'KPN.AS', name: 'KPN', description: 'Telecommunications' },
    { symbol: 'ABN.AS', name: 'ABN AMRO Bank', description: 'Banking' },
    { symbol: 'BESI.AS', name: 'BE Semiconductor', description: 'Semiconductors' },
    { symbol: 'ENX.PA', name: 'Euronext', description: 'Stock Exchange' },
    { symbol: 'NN.AS', name: 'NN Group', description: 'Insurance' },
    { symbol: 'ASRNL.AS', name: 'ASR Nederland', description: 'Insurance' },
    { symbol: 'AEG', name: 'Aegon', description: 'Insurance' },
    { symbol: 'AKZA.AS', name: 'Akzo Nobel', description: 'Chemicals' },
    { symbol: 'QGEN', name: 'Qiagen', description: 'Biotechnology' }
  ]
};

export const StockSelector = ({ onSelect, market, lang = 'en' }: StockSelectorProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const stocks = selectedCountry ? stocksByMarket[selectedCountry as keyof typeof stocksByMarket] : [];
  const t = translations[lang];

  const getCountryTranslation = (country: string) => {
    const translationKeys: Record<string, keyof typeof translations[Language]> = {
      'Germany': 'germany',
      'UK': 'uk',
      'France': 'france',
      'Italy': 'italy',
      'Netherlands': 'netherlands'
    };
    return t[translationKeys[country] as keyof typeof t] || country;
  };

  const getCountryDescription = (country: string) => {
    const descriptionKeys: Record<string, keyof typeof translations[Language]> = {
      'Germany': 'germanyStocks',
      'UK': 'ukStocks',
      'France': 'franceStocks',
      'Italy': 'italyStocks',
      'Netherlands': 'netherlandsStocks'
    };
    return t[descriptionKeys[country] as keyof typeof t] || `View ${country} stocks`;
  };

  // For US market, show stocks directly
  if (market === 'US') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {stocksByMarket.US.map((stock) => (
          <Card 
            key={stock.symbol}
            className="cursor-pointer bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all hover:scale-105"
            onClick={() => onSelect(stock.symbol)}
          >
            <CardContent className="flex items-center p-6">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-montserrat font-semibold text-gray-800">{stock.name}</h3>
                <p className="text-sm text-gray-600">{stock.symbol} - {stock.description}</p>
              </div>
              <ChevronRight className="h-6 w-6 text-gray-400" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // For EU market, show country selection first
  if (market === 'EU' && !selectedCountry) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {['Germany', 'UK', 'France', 'Italy', 'Netherlands'].map((country) => (
          <Card 
            key={country}
            className="cursor-pointer bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all hover:scale-105"
            onClick={() => setSelectedCountry(country)}
          >
            <CardContent className="flex items-center p-6">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-montserrat font-semibold text-gray-800">
                  {getCountryTranslation(country)}
                </h3>
                <p className="text-sm text-gray-600">{getCountryDescription(country)}</p>
              </div>
              <ChevronRight className="h-6 w-6 text-gray-400" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Show stocks for selected EU country
  return (
    <div className="space-y-4">
      <button
        onClick={() => setSelectedCountry(null)}
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
      >
        <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
        {t.backToCountries}
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stocks.map((stock) => (
          <Card 
            key={stock.symbol}
            className="cursor-pointer bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all hover:scale-105"
            onClick={() => onSelect(stock.symbol)}
          >
            <CardContent className="flex items-center p-6">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-montserrat font-semibold text-gray-800">{stock.name}</h3>
                <p className="text-sm text-gray-600">{stock.symbol} - {stock.description}</p>
              </div>
              <ChevronRight className="h-6 w-6 text-gray-400" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
