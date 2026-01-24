import React from "react";
import Image, { StaticImageData } from "next/image";
import Container from "../Container";
import Title from "../Title";

interface SponsorTier {
  tier: string;
  sponsors: {
    image: StaticImageData;
    alt: string;
    width?: string; // For custom widths like UofT vs COMPSA
    logoSize?: string; // For custom logo sizes
  }[];
  gradient: string;
  borderColor: string;
  tierColor: string; // Color for tier label text
}

interface SponsorsProps {
  tiers: SponsorTier[];
}

const Sponsors: React.FC<SponsorsProps> = ({ tiers }) => {
  return (
    <Container className="flex flex-col items-center gap-6 md:gap-8">
      <Title
        title="Our Sponsors"
        subtitle=""
      />
      
      <div className="w-full flex flex-col gap-12 md:gap-16">
        {tiers.map((tier, index) => (
          <div key={index} className="flex flex-col gap-0">
            {/* Tier Label - Right above the left card with no gap */}
            <div 
              className="text-[10px] md:text-[12px] font-bold tracking-[0.15em] uppercase pl-1 mb-1"
              style={{ color: tier.tierColor }}
            >
              {tier.tier}
            </div>

            {/* Sponsors Grid */}
            <div className={`grid ${
              tier.sponsors.length === 1 
                ? "grid-cols-1" 
                : tier.sponsors.length === 2 && tier.tier === "SILVER TIER"
                ? "grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4 md:gap-6" 
                : "grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            } w-full`}>
              {tier.sponsors.map((sponsor, sponsorIndex) => (
                <div
                  key={sponsorIndex}
                  className={`relative rounded-[15px] overflow-hidden group hover:scale-[1.01] transition-transform duration-300 ${sponsor.width || ''}`}
                  style={{
                    background: tier.gradient,
                  }}
                >
                  <div className="relative h-[100px] sm:h-[120px] md:h-[140px] lg:h-[155px] w-full flex items-center justify-center text-center px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6">
                    <Image
                      src={sponsor.image}
                      alt={sponsor.alt}
                      className={`object-contain w-auto max-w-full mx-auto ${
                        sponsor.logoSize || "max-h-[70px] sm:max-h-[85px] md:max-h-[100px] lg:max-h-[110px]"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Sponsors;
