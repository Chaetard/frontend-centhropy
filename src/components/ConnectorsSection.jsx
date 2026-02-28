import React, { useState } from 'react';

const connectorsData = [
    { id: 1, name: "Google", logo: "/src/assets/connectors/01_google_1.svg" },
    { id: 2, name: "Meta", logo: "/src/assets/connectors/02_meta_2-02.svg" },
    { id: 3, name: "AWS", logo: "/src/assets/connectors/03_aws_2-03.svg" },
    { id: 4, name: "Oracle", logo: "/src/assets/connectors/04_oracle_8.svg" },
    { id: 5, name: "Shopify", logo: "/src/assets/connectors/05_shopify_11.svg" },
    { id: 6, name: "WooCommerce", logo: "/src/assets/connectors/06_woocommerce_12.svg" },
    { id: 7, name: "Zoho", logo: "/src/assets/connectors/07_zoho_4.svg" },
    { id: 8, name: "HubSpot", logo: "/src/assets/connectors/08_hubspot_5.svg" },
    { id: 9, name: "Salesforce", logo: "/src/assets/connectors/09_salesforce_10.svg" },
    { id: 10, name: "Stripe", logo: "/src/assets/connectors/10_stripe_13.svg" },
    { id: 11, name: "Twilio", logo: "/src/assets/connectors/11_twilio_14.svg" },
    { id: 12, name: "Snowflake", logo: "/src/assets/connectors/12_snowflake_15.svg" },
    { id: 13, name: "MongoDB", logo: "/src/assets/connectors/13_mongodb_6.svg" },
    { id: 14, name: "MySQL", logo: "/src/assets/connectors/14_mysql_7.svg" },
    { id: 15, name: "PostgreSQL", logo: "/src/assets/connectors/15_postgres_9.svg" },
    { id: 16, name: "Files Connectors", logo: "/src/assets/connectors/16_filesconnectors_16.svg" }
];

const SearchIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const ConnectorsSection = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(8);

    const filteredConnectors = connectorsData.filter(connector =>
        connector.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const visibleConnectors = filteredConnectors.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount(filteredConnectors.length);
    };

    return (
        <div className="mt-24 mb-24 border-t border-black/10 pt-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                <div className="flex flex-col max-w-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/40 mb-2">Integración de Datos</span>
                    <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">INTEGRACIONES</h3>
                </div>
                <div className="w-full md:w-auto relative mb-4 md:mb-0">
                    <input
                        type="text"
                        placeholder="Buscar conector..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setVisibleCount(8);
                        }}
                        className="w-full md:w-[350px] border border-black/20 bg-white px-6 py-4 text-sm focus:outline-none focus:border-black transition-colors uppercase font-funnel tracking-widest placeholder:text-black/30"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-black/30" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
                {visibleConnectors.map((connector, idx) => (
                    <div
                        key={connector.id}
                        className="relative bg-[#f5f5f5] aspect-[20/9] flex items-center justify-center p-8 group hover:bg-[#ebebeb] transition-all duration-300"
                        style={{ clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)" }}
                    >
                        <img
                            src={connector.logo}
                            alt={connector.name}
                            className="max-w-[360px] max-h-[180px] w-[80%] h-[auto] object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105 transform"
                        />
                        <div className="absolute bottom-4 right-4 bg-black/[0.05] px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-[9px] uppercase tracking-widest text-black/60 font-bold">{connector.name}</span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredConnectors.length === 0 && (
                <div className="w-full py-20 text-center">
                    <p className="text-black/40 uppercase tracking-widest font-bold text-sm">No se encontraron conectores que coincidan con "{searchTerm}"</p>
                </div>
            )}

            {filteredConnectors.length > visibleCount && (
                <div className="flex justify-center">
                    <button
                        onClick={handleLoadMore}
                        className="border border-black text-black bg-transparent px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300 flex items-center active:scale-95"
                    >
                        Cargar Más
                    </button>
                </div>
            )}
        </div>
    );
};

export default ConnectorsSection;
