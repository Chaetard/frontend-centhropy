import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const connectorsData = [
    { id: 1, name: "Google", logo: "/connectors/01_google_1.svg" },
    { id: 2, name: "Meta", logo: "/connectors/02_meta_2-02.svg" },
    { id: 3, name: "AWS", logo: "/connectors/03_aws_2-03.svg" },
    { id: 4, name: "Oracle", logo: "/connectors/04_oracle_8.svg" },
    { id: 5, name: "Shopify", logo: "/connectors/05_shopify_11.svg" },
    { id: 6, name: "WooCommerce", logo: "/connectors/06_woocommerce_12.svg" },
    { id: 7, name: "Zoho", logo: "/connectors/07_zoho_4.svg" },
    { id: 8, name: "Hubspot", logo: "/connectors/08_hubspot_5.svg" },
    { id: 9, name: "Salesforce", logo: "/connectors/09_salesforce_10.svg" },
    { id: 10, name: "Stripe", logo: "/connectors/10_stripe_13.svg" },
    { id: 11, name: "Twilio", logo: "/connectors/11_twilio_14.svg" },
    { id: 12, name: "Snowflake", logo: "/connectors/12_snowflake_15.svg" },
    { id: 13, name: "MongoDB", logo: "/connectors/13_mongodb_6.svg" },
    { id: 14, name: "MySQL", logo: "/connectors/14_mysql_7.svg" },
    { id: 15, name: "PostgreSQL", logo: "/connectors/15_postgres_9.svg" },
    { id: 16, name: "Files", logo: "/connectors/16_filesconnectors_16.svg" }
];

const ShopifyLogo = ({ isDark }) => (
    <svg viewBox="0 0 1000 1000" className="w-full h-full max-w-none max-h-none md:max-w-[360px] md:max-h-[130px] md:w-[95%] md:h-auto object-contain p-0 md:p-0 transition-all duration-700 scale-[1.25] md:scale-[1.25] group-hover:scale-[1.35] md:group-hover:scale-[1.35] transform">
        <g>
            {/* Bag Front */}
            <path fill="#222944" d="M310.3,441.2c-0.1-1-1-1.4-1.6-1.4s-14.9-1.1-14.9-1.1s-9.9-9.9-11.1-10.9c-1.1-1.1-3.2-0.8-4-0.5c-0.1,0-2.2,0.7-5.5,1.7c-3.4-9.7-9.1-18.5-19.5-18.5h-1c-2.8-3.7-6.5-5.4-9.6-5.4c-23.9,0-35.5,29.9-39,45.1c-9.4,2.9-16,4.9-16.7,5.2c-5.2,1.6-5.3,1.7-6,6.6c-0.5,3.7-14.1,108.9-14.1,108.9L273,590.7l57.4-12.4C330.5,578.1,310.4,442.1,310.3,441.2z M267.2,430.5c-2.6,0.8-5.8,1.7-8.9,2.8v-2c0-5.9-0.8-10.7-2.2-14.5C261.5,417.6,264.9,423.5,267.2,430.5L267.2,430.5z M249.5,418.1c1.4,3.7,2.4,8.9,2.4,16.1v1.1c-5.9,1.8-12.1,3.7-18.5,5.8C237,427.3,243.8,420.6,249.5,418.1L249.5,418.1z M242.5,411.4c1.1,0,2.2,0.4,3,1.1c-7.7,3.6-15.9,12.6-19.3,30.9c-5.1,1.6-10,3-14.7,4.6C215.5,434,225.3,411.4,242.5,411.4z" />
            {/* Bag Side */}
            <path fill="#1B2136" d="M308.6,439.5c-0.7,0-14.9-1.1-14.9-1.1s-9.9-9.9-11.1-10.9c-0.4-0.4-1-0.7-1.4-0.7l-7.9,163.8l57.4-12.4c0,0-20.1-136.2-20.2-137.1C310.1,440.2,309.3,439.7,308.6,439.5z" />
            {/* The S */}
            <path className={isDark ? "fill-[#303A5F]" : "fill-[#F8F9FA]"} d="M253.6,471.3l-7,21c0,0-6.3-3.4-13.8-3.4c-11.2,0-11.7,7.1-11.7,8.8c0,9.6,25,13.3,25,35.8c0,17.7-11.2,29.1-26.3,29.1c-18.3,0-27.4-11.3-27.4-11.3l4.9-16.1c0,0,9.6,8.3,17.6,8.3c5.3,0,7.5-4.1,7.5-7.2c0-12.5-20.4-13.1-20.4-33.7c0-17.3,12.4-34,37.5-34C248.8,468.5,253.6,471.3,253.6,471.3z" />
            {/* Shopify Text */}
            <path fill={isDark ? "#BCC5DC" : "#222944"} d="M397.4,510.8c-5.8-3-8.7-5.8-8.7-9.4c0-4.6,4.1-7.5,10.5-7.5c7.5,0,14.1,3,14.1,3l5.2-16c0,0-4.8-3.7-18.9-3.7c-19.7,0-33.4,11.3-33.4,27.2c0,9,6.4,15.9,14.9,20.8c7,3.8,9.4,6.6,9.4,10.8c0,4.2-3.5,7.7-9.9,7.7c-9.5,0-18.5-4.9-18.5-4.9l-5.5,16c0,0,8.3,5.5,22.2,5.5c20.2,0,34.9-10,34.9-28C413.5,522.6,406.2,515.9,397.4,510.8z M478.1,477.1c-10,0-17.8,4.8-23.8,12l-0.2-0.1l8.7-45.2h-22.5l-22,115.3h22.5l7.5-39.4c2.9-14.9,10.7-24.1,17.8-24.1c5.1,0,7.1,3.5,7.1,8.4c0,3-0.2,7-1,10l-8.5,45.1h22.5l8.8-46.5c1-4.9,1.6-10.8,1.6-14.8C496.6,484.7,489.9,477.1,478.1,477.1L478.1,477.1z M547.6,477.1c-27.2,0-45.1,24.5-45.1,51.8c0,17.4,10.8,31.5,31,31.5c26.6,0,44.6-23.8,44.6-51.8C578.1,492.4,568.8,477.1,547.6,477.1z M536.5,543.2c-7.7,0-10.9-6.5-10.9-14.8c0-12.9,6.6-33.9,18.9-33.9c7.9,0,10.7,7,10.7,13.6C555.2,521.9,548.3,543.2,536.5,543.2L536.5,543.2z M635.8,477.1c-15.2,0-23.8,13.5-23.8,13.5h-0.2l1.3-12.1h-20c-1,8.2-2.8,20.7-4.6,29.9l-15.6,82.5h22.5l6.3-33.4h0.5c0,0,4.7,2.9,13.2,2.9c26.5,0,43.8-27.2,43.8-54.6C659.2,490.6,652.3,477.1,635.8,477.1z M614.3,543.4c-5.9,0-9.4-3.4-9.4-3.4l3.7-21c2.6-14.1,10-23.4,17.8-23.4c7,0,9,6.4,9,12.4C635.6,522.6,626.9,543.4,614.3,543.4L614.3,543.4z M691.4,444.8c-7.2,0-12.9,5.8-12.9,13.1c0,6.6,4.2,11.3,10.7,11.3h0.2c7.1,0,13.1-4.8,13.2-13.1C702.6,449.4,698.1,444.8,691.4,444.8z M659.8,558.8h22.5l15.2-80h-22.6 M755,478.7h-15.7l0.8-3.7c1.3-7.7,5.9-14.5,13.5-14.5c4,0,7.2,1.2,7.2,1.2l4.4-17.7c0,0-3.8-2-12.3-2c-7.9,0-16,2.3-22.1,7.5c-7.7,6.5-11.3,16-13.1,25.6l-0.7,3.7h-10.5l-3.4,17.1h10.5l-12,63.1h22.5l12-63.1h15.6L755,478.7L755,478.7z M809.3,478.8c0,0-14.1,35.6-20.3,55h-0.2c-0.4-6.3-5.5-55-5.5-55h-23.7l13.6,73.3c0.2,1.6,0.1,2.6-0.5,3.7c-2.6,5.1-7.1,10-12.3,13.6c-4.2,3-9,5.1-12.8,6.4l6.3,19.1c4.6-1,14.1-4.8,22.1-12.3c10.2-9.6,19.8-24.5,29.6-44.7l27.5-59.3h-23.6V478.8z" />
        </g>
    </svg>
);

const PostgresLogo = ({ isDark }) => (
    <svg viewBox="0 0 1000 1000" className="w-full h-full max-w-none max-h-none md:max-w-[360px] md:max-h-[130px] md:w-[95%] md:h-auto object-contain p-0 md:p-0 transition-all duration-700 scale-[1.25] md:scale-[1.25] group-hover:scale-[1.35] md:group-hover:scale-135 transform">
        <g fill={isDark ? "#BCC5DC" : "#222944"}>
            <path d="M310.5,499.5h-29.3v-29.4h30.9c11.3,0,16.9,5,16.9,14.9C329.1,494.7,322.9,499.5,310.5,499.5 M331.6,469.7 c-4-3.6-9.6-5.4-16.8-5.4l-41.9,0.2V535h8.4l-0.1-30h31.2c7.8,0,14-1.8,18.5-5.4c4.5-3.6,6.7-8.6,6.7-14.9 C337.6,478.3,335.6,473.3,331.6,469.7L331.6,469.7z M386.2,520.2c-0.8,2.3-2.2,4.4-4,6c-3.8,3.7-9.6,5.5-17.3,5.5 c-7,0-12.4-1.8-16.1-5.4c-3.8-3.6-5.6-8.4-5.6-14.4c0-3.1,0.5-5.9,1.5-8.3s2.4-4.5,4.3-6.1c3.9-3.5,9.2-5.3,16-5.3 c15.1,0,22.6,6.6,22.6,19.8C387.5,515.1,387.1,517.8,386.2,520.2 M387.8,494.2c-5.1-4.7-12.8-7.1-22.9-7.1 c-9.5,0-16.9,2.4-22.1,7.2c-4.7,4.3-7.1,10.2-7.1,17.6c0,7.3,2.4,13.2,7.3,17.7c2.7,2.4,5.8,4.2,9.3,5.3s7.7,1.6,12.5,1.6 c10,0,17.7-2.3,22.9-7c4.7-4.2,7.1-10.1,7.1-17.6C394.9,504.3,392.5,498.4,387.8,494.2L387.8,494.2z M451.6,522.2 c0,9.5-8.5,14.2-25.5,14.2c-5.2,0-9.6-0.3-13.1-1c-3.6-0.7-6.4-1.8-8.7-3.3c-1.7-1.2-3.1-2.7-4.1-4.5c-1-1.9-1.7-4.2-2-7.1 l7.9-0.1c0,3.7,1.4,6.5,4.1,8.2c3,2.1,8.2,3.2,15.8,3.2c11.9,0,17.8-3,17.8-8.9c0-3.5-2-5.9-6-7.2c-0.8-0.3-5.6-0.9-14.4-2 c-8.8-1.1-14.3-2.1-16.4-2.9c-4.7-1.9-7-5.2-7-10.1c0-4.7,2.1-8.3,6.3-10.6c2.1-1,4.7-1.7,7.8-2.2c3.1-0.5,6.7-0.8,10.8-0.8 c16.3,0,24.5,5.1,24.5,15.4H442c0-7.2-5.7-10.8-17.2-10.8c-5.8,0-10.2,0.8-13.1,2.2c-2.9,1.4-4.3,3.7-4.3,6.7 c0,2.8,1.9,4.9,5.8,6.1c2.3,0.7,7.5,1.4,15.6,2.3c7.3,0.7,12.3,1.6,15,2.8C449.1,513.9,451.7,517.3,451.6,522.2L451.6,522.2z M482.7,535.1l-3.2,0.5l-2,0.2c-5.1,0-8.8-0.7-11.1-2.2c-2.3-1.5-3.4-4.1-3.4-7.8v-32.2h-9.3v-4.7h9.3l0.1-15.2h7.2v15.2h12.5 v4.8l-12.5-0.1v31.3c0,2.3,0.6,3.9,1.9,4.8c1.2,0.9,3.4,1.3,6.6,1.3c0.5,0.1,1,0,1.5-0.1c0.8-0.1,1.7-0.3,2.5-0.6L482.7,535.1 L482.7,535.1z M532.5,524.4c-2,1.6-4.2,2.8-6.7,3.7c-2.5,0.9-5.4,1.3-8.7,1.3c-15.1,0-22.6-6.2-22.6-18.7 c0-5.8,1.9-10.3,5.8-13.6c3.9-3.3,9.3-4.9,16.3-4.9c7.1,0,12.4,1.7,16.1,5c3.7,3.3,5.5,7.7,5.5,13.3 C538.1,516.5,536.2,521.1,532.5,524.4 M545.3,488.7h-7.2l-0.1,7.9c-3.2-3.2-5.4-5.3-6.8-6.1c-4-2.2-9.2-3.3-15.7-3.3 c-9.4,0-16.5,2.1-21.5,6.4c-4.7,3.9-7,9.6-7,17.1c0,3.7,0.6,7,1.8,9.8c1.2,2.9,2.9,5.4,5.2,7.4c4.9,4.1,11.9,6.2,21,6.2 c10.9,0,18.6-3,23.1-8.9v8.2c0,5.2-1.7,9.3-5,12.2c-3.3,2.9-8.7,4.3-16.3,4.3c-7.1,0-12.2-1-15.2-2.9c-2.3-1.5-3.8-4.1-4.7-7.8 h-7.4c0.8,5.2,3,8.9,6.6,11.3c4.1,2.7,11.1,4,20.9,4c18.8,0,28.2-7,28.2-21L545.3,488.7L545.3,488.7z M584.2,493.4 c-2.2-0.4-4.2-0.5-6-0.5c-11.8,0-17.8,6.5-17.8,19.5V535h-7.1l-0.1-46.2l7.2,0.1v8.2h0.4c1.2-3.2,3.1-5.7,5.7-7.4 c2.9-1.6,7.2-2.4,12.8-2.4h4.8L584.2,493.4L584.2,493.4z M590.9,508.9c0.9-5.3,3-9.3,6.1-12.2c2.1-1.7,4.4-2.9,7-3.7 c2.6-0.8,5.5-1.3,8.8-1.3c6.4,0,11.6,1.8,15.7,5.3c4.1,3.5,6.1,7.5,6.1,11.9L590.9,508.9 M635.4,494.7c-2.5-2.5-5.6-4.4-9.4-5.6 c-3.7-1.2-8.1-1.8-13.1-1.8c-9.3,0-16.6,2.2-21.7,6.5c-5.1,4.3-7.7,10.2-7.7,17.7c0,7.5,2.5,13.4,7.4,17.8 c5.3,4.8,12.9,7.3,22.6,7.3c3.9,0,7.5-0.4,10.8-1.3s6.2-2.1,8.7-3.7c4.3-3.1,7.1-7,8.2-11.5h-7.8c-2.7,7.9-9.3,11.9-20,11.9 c-7.5,0-13.3-1.9-17.3-5.8c-3.5-3.3-5.2-7.6-5.2-12.9h51.4C642.3,505.3,640,499.1,635.4,494.7L635.4,494.7z"/><path d="M718.4,516.1c0,13.7-11.1,20.6-33.2,20.6c-13.3,0-22.9-2.4-29-7.1c-5-3.9-7.5-9.8-7.5-17.8h8.9 c0,12.8,9.2,19.2,27.6,19.2c8.8,0,15.2-1.3,19.2-3.9c3.3-2.3,5-5.9,5-10.9c0-4.9-2.3-8.3-6.8-10.3c-2.6-1.1-8.8-2.4-18.8-4 c-12.6-1.9-20.7-3.8-24.4-5.7c-5.4-2.8-8.1-7.6-8.1-14.4c0-6.3,2.3-11,6.9-14.1c4.9-3.4,13.4-5.1,25.4-5.1 c21.7,0,32.5,7.2,32.5,21.6h-9c0-10.8-8.1-16.2-24.2-16.2c-8.1,0-14,1.1-17.7,3.3c-3.5,2.3-5.3,5.7-5.3,10.2c0,4.7,2.3,8,6.8,9.9 c2.4,1.1,9.5,2.6,21.3,4.6c11.1,1.7,18.6,3.6,22.4,5.8C715.8,504.7,718.4,509.4,718.4,516.1L718.4,516.1z M790.8,523.1 c-3.3,2.7-7.1,4.7-11.3,6c-4.2,1.3-8.9,2-14.1,2c-10.6,0-19.2-2.9-25.7-8.6c-6.5-5.7-9.8-13.3-9.8-22.8c0-9.9,3.2-17.6,9.7-23.2 c6.5-5.5,15.1-8.3,25.8-8.3c10.9,0,19.4,2.9,25.6,8.7c3.3,2.8,5.7,6.1,7.3,9.9c1.6,3.8,2.3,8.1,2.3,12.9 C800.6,509.6,797.3,517.4,790.8,523.1 M795.5,527.8c4.6-3.3,8.1-7.2,10.3-11.9c2.2-4.7,3.3-10,3.3-16.1 c0-10.9-3.6-19.7-10.9-26.3c-3.9-3.6-8.6-6.3-14.1-8.1s-11.8-2.6-18.8-2.6c-13.7,0-24.5,3.3-32.3,10 c-7.8,6.6-11.7,15.7-11.7,27.1c0,11.1,3.9,20,11.8,26.8c7.9,6.8,18.7,10.2,32.3,10.2c5.3,0,10-0.4,14-1.1s7.4-1.8,10.1-3.3 l13.2,9.1l5.5-5L795.5,527.8L795.5,527.8z M875.8,535h-60.9v-70.5l8.4-0.2v64.8h52.6L875.8,535L875.8,535z"/><path d="M247.1,508.7c-0.5-1.6-2.3-5.3-9.2-4.1c-2.9,0.5-5.1,0.7-6.8,0.8c12.9-18.9,20.5-43.4,12.2-52.4 c-15.3-16.5-40.3-12.5-47.4-10.5c-3-0.5-6.2-0.7-9.6-0.8c-6.3-0.1-11.8,1.1-16.6,3.6c-7.1-2.1-28.4-7.2-41.1,2.4 c-6.9,5.2-10.1,13.5-9.4,24.7c0.2,3.6,8.2,46.2,24.5,52.3c2.5,0.9,7.1,1.7,12-2.2c1.4,1.7,3.8,3.1,7,3.7 c5.9,1.2,11.3,0.9,15.8-1.1c0,0.6,0,1.2,0.1,1.8c0,0.9,0.1,1.8,0.1,2.7c0.3,5.8,0.8,10.4,2.2,13.7c0.1,0.2,0.2,0.4,0.3,0.7 c1,2.7,3.9,10.2,14.1,10.2c1.3,0,2.8-0.1,4.4-0.4c12.5-2.3,19.8-7.9,20.6-30.1l0.1-1c0-0.1,0-0.2,0-0.3l1.7,0.1 c4.9,0.2,10.9-0.7,14.5-2.1C240.3,518.9,248.8,514.9,247.1,508.7z"/>
            {/* The white parts of the elephant should be the background color in negative/positive mode */}
            <path fill={isDark ? "#303A5F" : "#F8F9FA"} d="M243.7,509.5c-0.7-2.4-4.2-1.8-5.3-1.6c-8.7,1.5-12.2,0.6-13.5-0.1c14.6-19,22.6-45.2,15.8-52.6 c-15-16.3-39.4-10.7-44.4-9.3c-0.1,0-0.2,0-0.4,0.1l0,0c-0.1,0-0.2,0.1-0.3,0.1c-2.9-0.6-6.1-1-9.5-1.1c-6.2-0.1-11.5,1.2-16,3.8 c-4-1.4-27-8-39.6,1.5c-5.9,4.5-8.6,11.8-8,21.8c0.4,6.8,9.4,44.5,22.2,49.2c0.8,0.3,1.8,0.5,2.9,0.5c2.1,0,4.6-0.8,7.2-3.5 c4.7-4.7,9-8.7,10.4-10c2.3,1.1,4.9,1.7,7.5,1.8c-0.4,0.4-0.8,0.8-1.1,1.2c-1.8,1.9-2.2,2.3-8,3.4c-2.8,0.5-5.9,1.3-6,3.8 c-0.1,2.9,4.7,4.1,5.7,4.3c2,0.4,4,0.6,5.8,0.6c4.7,0,8.8-1.4,12.1-4c-0.1,10.1,0.4,20.1,1.8,23.1c1.2,2.5,4,8.5,12.8,8.5 c1.3,0,2.7-0.1,4.2-0.4c9.3-1.7,13.4-5.2,14.9-13c0.8-4.1,2.3-13.9,3-19.3c1.4,0.4,3.3,0.6,5.3,0.6c4.2,0,9.1-0.8,11.9-1.9 C236.2,516.6,244.7,513.2,243.7,509.5z M238.1,457.5c4.6,5-0.6,27.8-15.4,47.4c-0.2-0.2-0.4-0.5-0.7-0.7 c-1.1-1.2-2.5-2.6-3.5-4.8c-0.3-0.6-0.9-1.5-1.7-2.8c-3.1-4.7-10.2-15.6-7.2-20.3c1.6-2.5,6.3-3.3,13.5-2.3l0.5,0 c0.8-0.1,1.6-0.9,1.5-2.2c-0.3-3.6-7.2-17.4-23-23.7C210.6,446.7,227.3,445.8,238.1,457.5z M152.4,516c-2.2,2.3-4.3,3-6.5,2.2 c-10.5-3.9-19.6-39.4-20-46.2c-0.5-8.7,1.7-15.1,6.7-18.8c9.6-7.3,26.9-3.6,33.9-1.7c-0.5,0.4-1,0.9-1.5,1.4 c-9.2,9.4-8.9,23.8-8.9,24.4c0,0,0,0.1,0,0.1c0,0.3,0,0.8,0.1,1.4c0.2,2.6,0.5,7.4-0.4,12.9c-0.8,4.6,0.7,9.3,3.9,12.8 c0.7,0.8,1.5,1.4,2.3,2.1C160.3,508.3,156.5,511.8,152.4,516z M175.3,501.6l-0.3,0.6c-0.7,1.6-1.3,3-1.7,4.4c0,0-0.1,0-0.1,0 c-4.1,0-8-1.7-10.7-4.6c-2.6-2.8-3.7-6.3-3.1-9.9c1-5.9,0.6-11,0.4-13.7c0-0.3,0-0.6-0.1-0.8c1.8-1.3,9.5-4.6,14.6-3.3 c2.1,0.6,3.4,1.8,3.9,4c3,11.9,0.4,16.9-1.7,20.8C176.1,500,175.6,500.8,175.3,501.6z M164,519.4c-0.8-0.2-1.6-0.5-2.1-0.7 c0.5-0.2,1.2-0.4,2.3-0.5c6.7-1.2,7.6-1.9,9.9-4.4c0.5-0.6,1.1-1.2,1.9-2c0,0,0.1,0,0.1-0.1c1.3-1.2,2-0.9,3.1-0.6 c0.9,0.3,1.7,1.2,2,2.2c0.2,0.6,0.1,1.1-0.2,1.5C176.1,520.5,169.1,520.5,164,519.4z M199.5,547.2c-9.6,1.7-12-3.4-13.3-6.1 c-1.1-2.2-1.9-13.1-1.4-27.5c0-0.2,0-0.4-0.1-0.6c0-0.2-0.1-0.4-0.1-0.6c-0.6-2.1-2.2-3.9-4.2-4.6c-0.8-0.3-2.1-0.7-3.7-0.3 c0.4-1.1,0.9-2.4,1.5-3.8l0.3-0.6c0.3-0.7,0.7-1.4,1.1-2.2c2.3-4.3,5.4-10.1,2-23.3c-1.3-5.1-5.7-7.5-12.3-6.7 c-2.3,0.3-6.5,1.4-9.4,2.9c0.4-4.5,2-12.7,7.7-18.5c4.5-4.5,10.7-6.8,18.5-6.7c22.9,0.3,32.8,16.1,35.1,21.8 c-7.6-0.7-12.3,0.7-14.5,4.2c-4.2,6.7,3.3,18,7.3,24.1c0.7,1,1.3,2,1.5,2.4c1.3,2.6,2.9,4.4,4.1,5.6c0.2,0.2,0.5,0.5,0.7,0.8 c-2,0.5-5.6,1.9-5.3,7.7c-0.3,3.1-2.3,17-3.3,21.8C210.5,542.6,208.4,545.6,199.5,547.2z M234,513.8c-4.9,1.9-14,2.1-15.6,1 c-0.2-3.4,1.4-3.8,3.2-4.2c0.3-0.1,0.6-0.1,0.9-0.2c2,1.4,6.4,2.7,16.4,0.9C237.7,512,236.1,513,234,513.8z"/>
            <path fill={isDark ? "#303A5F" : "#F8F9FA"} d="M170.1,476.9c-0.1,0.5,1.1,1.9,2.7,2.1c1.6,0.2,2.9-0.9,3-1.4c0.1-0.5-1.1-1.1-2.7-1.3 C171.5,476.1,170.1,476.4,170.1,476.9z"/>
            <path fill={isDark ? "#303A5F" : "#F8F9FA"} d="M217.7,475.8c0.1,0.5-1.1,1.9-2.7,2.1c-1.6,0.2-2.9-0.9-3-1.4c-0.1-0.5,1.1-1.1,2.7-1.3 C216.3,475.1,217.6,475.3,217.7,475.8L217.7,475.8z"/>
            <path fill={isDark ? "#303A5F" : "#F8F9FA"} d="M220,505.7c-0.4,0-0.8-0.1-1.1-0.4c-0.7-0.6-0.9-1.7-0.3-2.4c3.6-4.5,2.9-8.9,2.3-13.6c-0.3-2-0.6-4-0.5-6 c0.1-2,0.4-3.7,0.7-5.3c0.4-1.9,0.7-3.6,0.5-5.7c-0.1-1,0.7-1.8,1.6-1.8c0.9-0.1,1.8,0.7,1.8,1.6c0.2,2.5-0.2,4.5-0.6,6.5 c-0.3,1.5-0.5,3-0.6,4.8c-0.1,1.7,0.2,3.5,0.5,5.4c0.7,5,1.5,10.6-3,16.3C221,505.5,220.5,505.7,220,505.7z"/>
        </g>
    </svg>
);

const ConnectorItem = ({ connector, isNew, newIdx, isMobile }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const isDark = document.documentElement.classList.contains('dark');

    return (
        <motion.div
            initial={isNew ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={isNew ? {
                duration: 0.45,
                delay: isMobile ? 0 : (newIdx * 0.04),
                ease: [0.22, 1, 0.36, 1]
            } : { duration: 0 }}
            className="relative bg-[#F8F9FA] dark:bg-[#303A5F] aspect-[4/3] md:aspect-[25/9] flex items-center justify-center p-0 md:p-3 group hover:bg-[#F1F3F5] dark:hover:bg-[#3a4672] transition-colors duration-300"
            style={{ clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)" }}
        >
            {connector.name === "Shopify" ? (
                <ShopifyLogo isDark={isDark} />
            ) : connector.name === "PostgreSQL" ? (
                <PostgresLogo isDark={isDark} />
            ) : (
                <img
                    src={connector.logo}
                    alt={connector.name}
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-full max-w-none max-h-none md:max-w-[360px] md:max-h-[130px] md:w-[95%] md:h-auto object-contain p-0 md:p-0 transition-all duration-700 scale-[1.25] md:scale-[1.25] group-hover:scale-[1.35] md:group-hover:scale-[1.35] transform ${imageLoaded ? 'opacity-80 group-hover:opacity-100' : 'opacity-0'} [filter:invert(13%)_sepia(31%)_saturate(1469%)_hue-rotate(193deg)_brightness(97%)_contrast(92%)] dark:invert dark:brightness-150 dark:opacity-80`}
                />
            )}
        </motion.div>
    );
};

const ConnectorsSection = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [visibleCount, setVisibleCount] = useState(8);

    // Ref que guarda desde qué índice empiezan las tarjetas NUEVAS.
    const newStartRef = useRef(-1);

    // Precarga de imágenes solo para mobile
    useEffect(() => {
        if (isMobile) {
            connectorsData.forEach((connector) => {
                const img = new Image();
                img.src = connector.logo;
            });
        }
    }, [isMobile]);

    // Detectar mobile
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(prev => {
                if (prev !== mobile) {
                    newStartRef.current = -1;
                    setVisibleCount(mobile ? 4 : 8);
                }
                return mobile;
            });
        };

        const initialMobile = window.innerWidth < 768;
        setIsMobile(initialMobile);
        setVisibleCount(initialMobile ? 4 : 8);

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const filteredConnectors = connectorsData.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const visibleConnectors = filteredConnectors.slice(0, visibleCount);
    const initialCount = isMobile ? 4 : 8;
    const increment = isMobile ? 4 : 8;

    const handleLoadMore = () => {
        newStartRef.current = visibleCount;
        setVisibleCount(prev => Math.min(prev + increment, filteredConnectors.length));
    };

    return (
        <div className="mt-6 md:mt-20 mb-12 md:mb-24 pt-0 md:pt-20 text-[#222944] dark:text-[#BCC5DC]">
            <div className="w-full h-[1px] bg-[#222944]/15 dark:bg-[#BCC5DC]/15 mb-10" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-8 w-full">
                <h3 className="text-[36px] md:text-[56px] font-light tracking-tighter leading-none m-0">
                    Integraciones
                </h3>
                <div className="w-full md:w-auto relative mb-1">
                    <input
                        type="text"
                        placeholder="Buscar Conector"
                        value={searchTerm}
                        onChange={(e) => {
                            newStartRef.current = -1;
                            setSearchTerm(e.target.value);
                            setVisibleCount(initialCount);
                        }}
                        className="w-full md:w-[350px] border border-[#222944]/20 dark:border-[#BCC5DC]/20 bg-white dark:bg-[#222944] px-6 py-4 text-sm focus:outline-none focus:border-[#222944] dark:focus:border-[#BCC5DC] transition-colors font-funnel tracking-widest text-[#222944] dark:text-[#BCC5DC] placeholder:text-[#222944]/30 dark:placeholder:text-[#BCC5DC]/50"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#222944]/20 dark:text-[#BCC5DC]/40 pointer-events-none">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
                {visibleConnectors.map((connector, idx) => {
                    const isNew = newStartRef.current >= 0 && idx >= newStartRef.current;
                    const newIdx = isNew ? idx - newStartRef.current : 0;

                    return (
                        <ConnectorItem
                            key={connector.id}
                            connector={connector}
                            isNew={isNew}
                            newIdx={newIdx}
                            isMobile={isMobile}
                        />
                    );
                })}
            </div>

            {filteredConnectors.length === 0 && (
                <div className="w-full py-20 text-center">
                    <p className="text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest font-bold text-sm">
                        No se encontraron conectores que coincidan con "{searchTerm}"
                    </p>
                </div>
            )}

            {visibleCount < filteredConnectors.length && (
                <div className="flex justify-center">
                    <button
                        onClick={handleLoadMore}
                        className="border border-[#222944] dark:border-[#BCC5DC] text-[#222944] dark:text-[#BCC5DC] bg-transparent px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#222944] hover:border-[#222944] hover:text-white dark:hover:bg-[#BCC5DC] dark:hover:text-[#222944] transition-all duration-300 flex items-center active:scale-95"
                    >
                        Cargar Más
                    </button>
                </div>
            )}
        </div>
    );
};

export default ConnectorsSection;
